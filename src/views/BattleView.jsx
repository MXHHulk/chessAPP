import React, { useState, useEffect, useCallback } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { Sword, RotateCcw, Settings2, User, Cpu, AlertCircle, CheckCircle2, Bot } from 'lucide-react';
import { useAICoach } from '../hooks/useAICoach'; // 👉 新增：引入你的 AI Hook

const BattleView = () => {
  const [game, setGame] = useState(new Chess());
  const [playerColor, setPlayerColor] = useState('w');
  const [difficulty, setDifficulty] = useState(5);
  const [isEngineThinking, setIsEngineThinking] = useState(false);
  
  // 狀態與 UI 顯示
  const [gameStatus, setGameStatus] = useState('輪到你了！');
  const [statusType, setStatusType] = useState('normal'); 

  // 高亮位置與點擊移動狀態
  const [selectedSquare, setSelectedSquare] = useState('');
  const [optionSquares, setOptionSquares] = useState({});

  // 👉 新增：初始化 AI 教練狀態
  const { aiFeedback, isLoading: isCoachLoading, askCoach, resetCoach } = useAICoach();

  // 判斷遊戲狀態 (將軍、和局等)
  const updateStatus = useCallback((currentGame) => {
    if (currentGame.isCheckmate()) {
      setGameStatus(currentGame.turn() === playerColor ? '你被將死了！' : '你贏了！將死對手！');
      setStatusType(currentGame.turn() === playerColor ? 'warning' : 'success');
    } else if (currentGame.isDraw()) {
      setGameStatus('和局！遊戲結束。');
      setStatusType('normal');
    } else if (currentGame.isCheck()) {
      setGameStatus('被將軍了！');
      setStatusType('warning');
    } else {
      const isPlayerTurn = currentGame.turn() === playerColor;
      setGameStatus(isPlayerTurn ? '輪到你了！' : '引擎思考中...');
      setStatusType(isPlayerTurn ? 'normal' : 'thinking');
    }
  }, [playerColor]);

  // 呼叫後端讓 Stockfish 下棋
  const makeEngineMove = useCallback(async () => {
    if (game.isGameOver()) return;

    setIsEngineThinking(true);
    setStatusType('thinking');
    
    try {
      const response = await fetch('http://localhost:5000/api/engine_move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen: game.fen(), skill_level: difficulty })
      });
      
      const data = await response.json();
      
      if (data.best_move) {
        const from = data.best_move.substring(0, 2);
        const to = data.best_move.substring(2, 4);
        const promotion = data.best_move.length === 5 ? data.best_move[4] : undefined;

        const gameCopy = new Chess(game.fen());
        gameCopy.move({ from, to, promotion });
        
        setGame(gameCopy);
        updateStatus(gameCopy);
      }
    } catch (error) {
      console.error('呼叫引擎失敗:', error);
      setGameStatus('連線失敗，請確認後端已啟動');
      setStatusType('warning');
    } finally {
      setIsEngineThinking(false);
    }
  }, [game, difficulty, updateStatus]);

  // 監聽回合變化：如果輪到引擎，就呼叫引擎
  useEffect(() => {
    if (game.turn() !== playerColor && !game.isGameOver()) {
      makeEngineMove();
    }
  }, [game.fen(), playerColor]);

  // 取得可以走步的位置，並設定高亮樣式
  const getMoveOptions = (square) => {
    if (isEngineThinking || game.turn() !== playerColor) return; 

    const piece = game.get(square);
    if (!piece || piece.color !== playerColor) {
      setOptionSquares({});
      return;
    }

    const moves = game.moves({ square, verbose: true });
    if (moves.length === 0) {
      setOptionSquares({ [square]: { background: 'rgba(255, 255, 0, 0.4)' } });
      return;
    }

    const newSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background: (move.flags.includes('c') || move.flags.includes('e'))
          ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
          : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
    });
    newSquares[square] = { background: 'rgba(255, 255, 0, 0.4)' };
    setOptionSquares(newSquares);
  };

  // 共用的邏輯移動處理器
  const handleLogicMove = (sourceSquare, targetSquare, promotionP) => {
    if (isEngineThinking || game.turn() !== playerColor) return false;

    let gameCopy = new Chess(game.fen());
    try {
      const validMove = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionP || 'q',
      });
      if (validMove) {
        setGame(gameCopy);
        updateStatus(gameCopy);
        setSelectedSquare('');
        setOptionSquares({});
        
        // 👉 核心邏輯：在玩家成功移動後，立刻將「這步棋」與「當前盤面」丟給 AI 教練分析！
        askCoach(gameCopy.fen(), validMove.san);
        
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  // 點擊棋盤處理
  const onSquareClick = (square) => {
    if (isEngineThinking || game.turn() !== playerColor) return;
    
    if (selectedSquare && optionSquares[square] && square !== selectedSquare) {
      const moveResult = handleLogicMove(selectedSquare, square, 'q'); 
      if (moveResult) return;
    }

    const piece = game.get(square);
    if (piece && piece.color === playerColor) {
      setSelectedSquare(square);
      getMoveOptions(square);
    } else {
      setSelectedSquare('');
      setOptionSquares({});
    }
  };

  // 拖曳開始處理
  const onPieceDragBegin = (piece, sourceSquare) => {
    if (isEngineThinking || game.turn() !== playerColor) return;
    setSelectedSquare(sourceSquare);
    getMoveOptions(sourceSquare);
  };

  // 拖曳放下處理
  const onPieceDrop = (sourceSquare, targetSquare, piece) => {
    setSelectedSquare('');
    setOptionSquares({});
    
    const isPawn = piece[1] === 'P'; 
    const isPromotionRank = targetSquare[1] === '8' || targetSquare[1] === '1';
    
    if (isPawn && isPromotionRank) return true; // 交給 onPromotionPieceSelect 處理
    
    return handleLogicMove(sourceSquare, targetSquare, piece[1]?.toLowerCase() || 'q');
  };

  const onPromotionPieceSelect = (piece, sourceSquare, targetSquare) => {
    const promotionPiece = piece[1]?.toLowerCase() || 'q';
    return handleLogicMove(sourceSquare, targetSquare, promotionPiece);
  };

  const resetGame = () => {
    setGame(new Chess());
    setGameStatus('遊戲開始！');
    setStatusType('normal');
    setSelectedSquare('');
    setOptionSquares({});

    resetCoach();
  };
  // 🪄 更新版：對應 /chessAPP 路徑的魔法棋子工廠
  const getMagicPieces = (playerColor) => {
    const wSide = playerColor === 'white' ? 'back' : 'front';
    const bSide = playerColor === 'white' ? 'front' : 'back';

    // 👉 新增這行：把你的專屬路徑定義好
    const basePath = '/chessAPP/pieces';

    const createPiece = (src, scale = 0.8, offsetY = '0%') => ({ squareWidth }) => (
      <div className="flex items-center justify-center w-full h-full pointer-events-none">
        <img
          src={src}
          style={{
            width: squareWidth * scale,
            transform: `translateY(${offsetY})`,
          }}
          className="drop-shadow-xl"
          alt="魔法棋子"
        />
      </div>
    );

    return {
      // ⚔️ 把原本的 /pieces/... 換成包含 basePath 的變數寫法
      wP: createPiece(`${basePath}/wP_${wSide}.gif`),
      wN: createPiece(`${basePath}/wN_${wSide}.gif`),
      wB: createPiece(`${basePath}/wB_${wSide}.gif`),
      wQ: createPiece(`${basePath}/wQ_${wSide}.gif`),
      wK: createPiece(`${basePath}/wK_${wSide}.gif`),

      bP: createPiece(`${basePath}/bP_${bSide}.gif`),
      bN: createPiece(`${basePath}/bN_${bSide}.gif`),
      bB: createPiece(`${basePath}/bB_${bSide}.gif`),
      bQ: createPiece(`${basePath}/bQ_${bSide}.gif`),
      bK: createPiece(`${basePath}/bK_${bSide}.gif`),

      // 🏰 巨大的城堡
      wR: createPiece(`${basePath}/wR_idel.gif`, 1.3, '-15%'),
      bR: createPiece(`${basePath}/bR_idel.gif`, 1.3, '-15%'),
    };
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500 min-h-[600px] flex flex-col xl:flex-row gap-6 items-stretch">
      
      {/* =========================================
          左欄：對戰大廳設定 (約 25%) 
      ========================================= */}
      <aside className="w-full xl:w-[25%] bg-slate-100 rounded-[40px] p-6 border border-slate-200 flex flex-col gap-6">
        
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
          <div className="bg-white p-2.5 rounded-2xl text-emerald-600 shadow-sm flex-shrink-0">
            <Sword className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">對戰設定</h2>
        </div>
        
        <div className="flex flex-col gap-2.5">
          <label className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
            <User className="w-3.5 h-3.5" /> 陣營選擇
          </label>
          <div className="flex flex-col gap-2">
            <button 
              onClick={() => { setPlayerColor('w'); resetGame(); }}
              className={`w-full py-3 px-4 rounded-[16px] font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                playerColor === 'w' 
                  ? 'bg-white text-slate-900 border-emerald-500 shadow-sm scale-[1.02]' 
                  : 'bg-white/50 text-slate-500 border-transparent hover:border-slate-300'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-slate-100 border-2 border-slate-300"></div> 白方先手
            </button>
            <button 
              onClick={() => { setPlayerColor('b'); resetGame(); }}
              className={`w-full py-3 px-4 rounded-[16px] font-bold border-2 transition-all flex items-center justify-center gap-2 ${
                playerColor === 'b' 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]' 
                  : 'bg-white/50 text-slate-500 border-transparent hover:border-slate-300'
              }`}
            >
              <div className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-slate-600"></div> 黑方後手
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-3 bg-white p-5 rounded-[24px] shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-black text-slate-400 flex items-center gap-2 uppercase tracking-widest">
              <Settings2 className="w-3.5 h-3.5" /> AI 難度
            </label>
            <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-xl font-black text-xs">
              Lv. {difficulty}
            </span>
          </div>
          <input 
            type="range" min="0" max="20" value={difficulty} 
            onChange={(e) => setDifficulty(parseInt(e.target.value))} 
            className="w-full h-2.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-500 outline-none"
          />
        </div>

        <div className="flex-grow"></div>

        <button 
          onClick={resetGame} disabled={isEngineThinking}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base rounded-[20px] transition-all flex items-center justify-center gap-2 shadow-[0_5px_0_0_#059669] hover:shadow-[0_2px_0_0_#059669] hover:translate-y-[3px] active:shadow-none active:translate-y-[5px] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-5 h-5" /> 重新開始
        </button>
      </aside>

      {/* =========================================
          中欄：對戰棋盤區 (約 45%) 
      ========================================= */}
      <section className="w-full xl:w-[45%] flex flex-col items-center justify-center bg-white rounded-[40px] p-6 shadow-sm border border-slate-200 relative overflow-hidden">
        
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-emerald-500/5 blur-3xl rounded-full pointer-events-none" />

        <div className="z-10 w-full max-w-[500px]">
          <div className={`mb-5 p-3 rounded-[16px] flex items-center justify-center gap-2 transition-colors duration-300 shadow-sm border ${
            statusType === 'warning' ? 'bg-rose-50 text-rose-600 border-rose-200' :
            statusType === 'success' ? 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-500/30' :
            statusType === 'thinking' ? 'bg-slate-50 text-slate-500 border-slate-200 animate-pulse' :
            'bg-emerald-50 text-emerald-700 border-emerald-100'
          }`}>
            {statusType === 'warning' && <AlertCircle className="w-5 h-5" />}
            {statusType === 'thinking' && <Cpu className="w-5 h-5" />}
            {statusType === 'success' && <CheckCircle2 className="w-5 h-5" />}
            <h3 className="text-lg font-black tracking-wide">{gameStatus}</h3>
          </div>

          <div className={`rounded-xl overflow-hidden shadow-2xl transition-all duration-300 ring-4 ${
            isEngineThinking ? 'ring-slate-200 opacity-95' : 'ring-emerald-500/20'
          }`}>
            <Chessboard 
              customPieces={getMagicPieces(playerColor === 'w' ? 'white' : 'black')}
              position={game.fen()} 
              onPieceDrop={onPieceDrop}
              onSquareClick={onSquareClick}
              onPieceDragBegin={onPieceDragBegin}
              customSquareStyles={optionSquares}
              showPromotionDialog={true}
              onPromotionPieceSelect={onPromotionPieceSelect}
              boardOrientation={playerColor === 'w' ? 'white' : 'black'}
              animationDuration={300}
              customDarkSquareStyle={{ backgroundColor: '#739552' }}
              customLightSquareStyle={{ backgroundColor: '#EBECD0' }}
            />
          </div>
        </div>
      </section>

      {/* =========================================
          右欄：AI 指導區 (約 30%) 
      ========================================= */}
      <aside className="w-full xl:w-[30%] bg-slate-100 rounded-[40px] p-6 border border-slate-200 flex flex-col">
        
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 mb-4">
          <div className="bg-emerald-500 p-2.5 rounded-2xl text-white shadow-sm flex-shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Ollama 教練</h2>
        </div>

        {/* AI 回饋顯示區塊 */}
        <div className="flex-grow bg-white p-5 rounded-[24px] shadow-sm border border-emerald-100 flex flex-col relative overflow-hidden">
          {/* 背景裝飾 */}
          <div className="absolute -right-8 -top-8 text-emerald-50 opacity-50 pointer-events-none">
            <Bot className="w-32 h-32" />
          </div>

          <h4 className="font-black text-sm text-emerald-600 mb-3 uppercase tracking-widest relative z-10 flex items-center gap-2">
            即時盤面分析
          </h4>
          
          <div className="flex-grow text-sm text-slate-700 leading-loose font-medium relative z-10 whitespace-pre-wrap">
            {isCoachLoading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-emerald-500 animate-pulse">
                <Cpu className="w-8 h-8" />
                <span className="font-bold">教練正在與 Stockfish 推演中...</span>
              </div>
            ) : (
              aiFeedback
            )}
          </div>
        </div>
      </aside>

    </div>
  );
};

export default BattleView;