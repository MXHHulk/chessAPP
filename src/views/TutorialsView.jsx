import { useState, useEffect } from 'react';
import { ChevronRight, Info, RotateCcw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { TUTORIALS } from '../data/tutorials';

// ============================================================
// TutorialsView - 基礎課程頁面 (互動式教學 - 三欄式)
// ============================================================

export const TutorialsView = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tutorial = TUTORIALS[selectedIndex];
  
  const [game, setGame] = useState(new Chess());
  const [currentFen, setCurrentFen] = useState(tutorial.fen);
  
  // 互動任務狀態
  const [taskStep, setTaskStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');
  
  // 高亮位置狀態
  const [selectedSquare, setSelectedSquare] = useState('');
  const [optionSquares, setOptionSquares] = useState({});

  useEffect(() => {
    resetTutorial();
    // eslint-disable-next-line
  }, [selectedIndex, tutorial.fen]);

  const resetTutorial = () => {
    try {
      const newGame = new Chess(tutorial.fen);
      setGame(newGame);
    } catch {}
    setCurrentFen(tutorial.fen);
    setTaskStep(0);
    setIsSuccess(false);
    setFeedbackError('');
    setSelectedSquare('');
    setOptionSquares({});
  };

  const interactiveTask = tutorial.interactiveTask;

  // 取得可以走步的位置，並且設定高亮樣式（無分回合）
  const getMoveOptions = (square) => {
    if (isSuccess || tutorial.readOnly) return; 

    const piece = game.get(square);
    if (!piece) {
       setOptionSquares({});
       return;
    }

    let searchGame = game;
    // 重點優化：為了讓新手可以看到非當前回合棋子的走法
    // 建立一個臨時的盤面並強制切換回合 (w <=> b)
    if (piece.color !== game.turn()) {
      const fenTokens = game.fen().split(' ');
      fenTokens[1] = piece.color;
      fenTokens[3] = '-'; // 剛切換回合無法確定過路兵狀態，一律清除避免 FEN 載入錯誤
      try {
        searchGame = new Chess(fenTokens.join(' '));
      } catch (e) {
        searchGame = game; // 失效時降級為原本狀態
      }
    }

    const moves = searchGame.moves({
      square,
      verbose: true,
    });
    
    if (moves.length === 0) {
      setOptionSquares({ [square]: { background: 'rgba(255, 255, 0, 0.4)' } });
      return;
    }

    const newSquares = {};
    moves.forEach((move) => {
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
    });
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
  };

  const onSquareClick = (square) => {
    if (isSuccess) return;
    
    if (selectedSquare && optionSquares[square] && square !== selectedSquare) {
      const moveResult = handleLogicMove(selectedSquare, square, 'q'); 
      if (moveResult) {
        setSelectedSquare('');
        setOptionSquares({});
        return;
      }
    }

    const piece = game.get(square);
    if (piece) {
      setSelectedSquare(square);
      getMoveOptions(square);
    } else {
      setSelectedSquare('');
      setOptionSquares({});
    }
  };

  const onPieceDragBegin = (piece, sourceSquare) => {
    if (isSuccess) return;
    setSelectedSquare(sourceSquare);
    getMoveOptions(sourceSquare);
  };

  const onPieceDrop = (sourceSquare, targetSquare, piece) => {
    setSelectedSquare('');
    setOptionSquares({});
    return handleLogicMove(sourceSquare, targetSquare, piece[1]?.toLowerCase() || 'q');
  };

  const handleLogicMove = (sourceSquare, targetSquare, promotionP) => {
    if (isSuccess) return false;
    setFeedbackError('');

    const gameCopy = new Chess(game.fen());

    if (interactiveTask) {
      // 預留機制：未來如加入黑方自動回應，可在此處判定回合數或增加黑方回應邏輯
      const expectedMove = interactiveTask.expectedMoves[taskStep];
      if (
        sourceSquare === expectedMove.from && 
        targetSquare === expectedMove.to &&
        (!expectedMove.promotion || expectedMove.promotion === promotionP)
      ) {
        try {
          const validMove = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: expectedMove.promotion || promotionP || 'q',
          });
          if (validMove) {
            setGame(gameCopy);
            setCurrentFen(gameCopy.fen());
            
            if (taskStep + 1 >= interactiveTask.expectedMoves.length) {
              setIsSuccess(true);
            } else {
              setTaskStep(step => step + 1);
            }
            return true;
          }
        } catch {
          return false;
        }
      } else {
         setFeedbackError('這步棋不是我們要練習的走法喔，請再試一次！');
         return false;
      }
    }

    try {
      const validMove = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: promotionP || 'q',
      });
      if (validMove) {
        setGame(gameCopy);
        setCurrentFen(gameCopy.fen());
        return true;
      }
    } catch {
      return false;
    }
    return false;
  };

  const nextModule = () => {
    if (selectedIndex < TUTORIALS.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      // 清理選單捲軸狀態或回到頂部（針對外層若有容器）
      const listContainer = document.getElementById('tutorial-list');
      if (listContainer) {
        const activeBtn = listContainer.children[selectedIndex + 1];
        if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden">
      
      {/* 隱藏捲軸的自訂 CSS */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 20px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>

      <div className="flex w-full gap-6 h-full">

        {/* =========================================
            左欄：側邊選單 (約 25%) 
        ========================================= */}
        <aside className="w-[25%] flex flex-col gap-3 pr-2 overflow-y-auto custom-scrollbar pb-4" id="tutorial-list">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 flex-shrink-0">
            教學模組
          </h3>
          {TUTORIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setSelectedIndex(idx)}
              className={[
                'w-full text-left p-5 rounded-[24px] transition-all border-2 flex items-center justify-between group flex-shrink-0',
                selectedIndex === idx
                  ? 'bg-white border-emerald-500 shadow-xl scale-[1.02]'
                  : 'bg-white/50 border-transparent hover:border-slate-300',
              ].join(' ')}
            >
              <div>
                <span className="block text-[10px] font-black text-emerald-600 mb-1">
                  0{idx + 1} MODULE
                </span>
                <span className={`font-bold text-base ${selectedIndex === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                  {t.title.split('：')[0]} {/* 只顯示前綴縮短長度 */}
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform flex-shrink-0 ${selectedIndex === idx ? 'text-emerald-500 rotate-90' : 'text-slate-300 group-hover:translate-x-1'}`} />
            </button>
          ))}
        </aside>

        {/* =========================================
            中欄：內容與互動區 (約 45%) 
        ========================================= */}
        <section className="w-[45%] flex flex-col bg-white rounded-[40px] p-8 shadow-sm border border-slate-200 overflow-y-auto custom-scrollbar relative">
          
          <div className="mb-6 flex-shrink-0">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">{tutorial.title}</h2>
          </div>

          <div className="relative group w-full max-w-[420px] mx-auto flex-shrink-0">
            <div className="absolute -inset-4 bg-emerald-500/5 blur-2xl opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className={`relative transition-all duration-300 ${isSuccess ? 'ring-4 ring-emerald-400 ring-offset-4 rounded-xl' : ''}`}>
              <ChessBoard 
                fen={currentFen} 
                onDrop={onPieceDrop}
                onSquareClick={onSquareClick}
                onPieceDragBegin={onPieceDragBegin}
                customSquareStyles={optionSquares}
              />
            </div>
            
            <div className="mt-6 flex justify-center">
              <button
                onClick={resetTutorial}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition"
              >
                <RotateCcw className="w-4 h-4" /> 重新設定佈局
              </button>
            </div>
          </div>

          {/* 互動任務區塊 */}
          {interactiveTask && (
            <div className="mt-8 transition-all flex-shrink-0">
              {!isSuccess ? (
                <div className="p-5 bg-slate-50 border-2 border-dashed border-slate-300 rounded-[24px] text-center">
                  <p className="text-base font-bold text-slate-700">{interactiveTask.instruction}</p>
                  {feedbackError && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-rose-500 font-bold animate-pulse text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>{feedbackError}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-[24px] text-center animate-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 mb-3">
                    <CheckCircle2 className="w-6 h-6 flex-none" />
                    <p className="text-lg font-black">{interactiveTask.successMessage}</p>
                  </div>
                  {selectedIndex < TUTORIALS.length - 1 && (
                    <button
                      onClick={nextModule}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1 text-sm"
                    >
                      進入下一課 <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </section>

        {/* =========================================
            右欄：章節要點與說明 (約 30%) 
        ========================================= */}
        <section className="w-[30%] flex flex-col bg-slate-100 rounded-[40px] p-8 border border-slate-200 overflow-y-auto custom-scrollbar">
          
          <div className="mb-8">
            <h4 className="font-black text-lg text-slate-400 uppercase tracking-widest mb-3">
              本課說明
            </h4>
            <p className="text-lg text-slate-700 leading-relaxed font-medium">
              {tutorial.description}
            </p>
          </div>

          <div className="p-6 bg-white rounded-[24px] shadow-sm border border-slate-100">
            <h4 className="font-black text-xl text-slate-900 mb-6 flex items-center gap-3">
              <Info className="w-6 h-6 text-emerald-500" /> 章節要點
            </h4>
            <ul className="space-y-4">
              {tutorial.steps.map((step, i) => (
                <li key={i} className="flex gap-4 text-slate-600 leading-relaxed items-start">
                  <span className="flex-none w-6 h-6 bg-emerald-500 text-emerald-950 rounded-full flex items-center justify-center text-[10px] font-black mt-1">
                    {i + 1}
                  </span>
                  <span className="font-medium text-sm">{step}</span>
                </li>
              ))}
            </ul>
          </div>
          
        </section>

      </div>
    </div>
  );
};
