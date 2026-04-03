import { useState, useEffect } from 'react';
import { ChevronRight, Info, RotateCcw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { TUTORIALS } from '../data/tutorials';

// ============================================================
// TutorialsView - 基礎課程頁面 (互動式教學)
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

  // 取得可以走步的位置，並且設定高亮樣式
  const getMoveOptions = (square) => {
    if (isSuccess || tutorial.readOnly) return; // 完成或唯讀狀態下不高亮

    const moves = game.moves({
      square,
      verbose: true,
    });
    
    if (moves.length === 0) {
      setOptionSquares({ [square]: { background: 'rgba(255, 255, 0, 0.4)' } });
      return;
    }

    const newSquares = {};
    moves.forEach((move) => {
      // 若目標格子有棋子(吃子)則使用較大空心圓，否則用小實心圓
      newSquares[move.to] = {
        background:
          game.get(move.to) && game.get(move.to).color !== game.get(square).color
            ? 'radial-gradient(circle, rgba(0,0,0,.1) 85%, transparent 85%)'
            : 'radial-gradient(circle, rgba(0,0,0,.1) 25%, transparent 25%)',
        borderRadius: '50%',
      };
    });
    // 高亮被選取的格子
    newSquares[square] = {
      background: 'rgba(255, 255, 0, 0.4)',
    };
    setOptionSquares(newSquares);
  };

  // 當使用者點擊格子時觸發的邏輯
  const onSquareClick = (square) => {
    if (isSuccess) return;
    
    // 若已選取且點擊的是可移動的位置，則自動進行移動
    if (selectedSquare && optionSquares[square] && square !== selectedSquare) {
      const moveResult = handleLogicMove(selectedSquare, square, 'q'); // 預設點擊升變為后
      if (moveResult) {
        setSelectedSquare('');
        setOptionSquares({});
        return;
      }
    }

    // 否則，檢測點下去的格子上方是否有棋子，有的話就顯示移動點
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

  // 獨立出的下棋處理邏輯
  const handleLogicMove = (sourceSquare, targetSquare, promotionP) => {
    if (isSuccess) return false;
    setFeedbackError('');

    const gameCopy = new Chess(game.fen());

    // 嚴格互動模式：如有任務，必須符合預期步數
    if (interactiveTask) {
      const expectedMove = interactiveTask.expectedMoves[taskStep];
      if (
        sourceSquare === expectedMove.from && 
        targetSquare === expectedMove.to &&
        (!expectedMove.promotion || expectedMove.promotion === promotionP)
      ) {
        // 解答正確，進行移動
        try {
          const validMove = gameCopy.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: expectedMove.promotion || promotionP || 'q',
          });
          if (validMove) {
            setGame(gameCopy);
            setCurrentFen(gameCopy.fen());
            
            // 推進任務狀態
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
         // 走錯步
         setFeedbackError('這步棋不是我們要練習的走法喔，請再試一次！');
         return false;
      }
    }

    // 自由模式：沒有設定 interactiveTask 時
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500">
      <div className="flex flex-col lg:flex-row gap-10">

        {/* 側邊選單 */}
        <aside className="lg:w-1/3 space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2">教學模組</h3>
          {TUTORIALS.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setSelectedIndex(idx)}
              className={[
                'w-full text-left p-6 rounded-3xl transition-all border-2 flex items-center justify-between group',
                selectedIndex === idx
                  ? 'bg-white border-emerald-500 shadow-xl scale-[1.02]'
                  : 'bg-white/50 border-transparent hover:border-slate-300',
              ].join(' ')}
            >
              <div>
                <span className="block text-[10px] font-black text-emerald-600 mb-1">
                  0{idx + 1} MODULE
                </span>
                <span className={`font-black text-lg ${selectedIndex === idx ? 'text-slate-900' : 'text-slate-500'}`}>
                  {t.title}
                </span>
              </div>
              <ChevronRight className={`w-5 h-5 transition-transform ${selectedIndex === idx ? 'text-emerald-500 rotate-90' : 'text-slate-300 group-hover:translate-x-1'}`} />
            </button>
          ))}
        </aside>

        {/* 內容區 */}
        <section className="lg:w-2/3 bg-white rounded-[40px] p-8 md:p-12 shadow-sm border border-slate-200">
          <div className="mb-10">
            <h2 className="text-4xl font-black text-slate-900 mb-4">{tutorial.title}</h2>
            <p className="text-xl text-slate-500 leading-relaxed">{tutorial.description}</p>
          </div>

          <div className="relative group max-w-[480px] mx-auto">
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
            <div className="mt-8 transition-all">
              {!isSuccess ? (
                <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-[24px] text-center">
                  <p className="text-lg font-bold text-slate-700">{interactiveTask.instruction}</p>
                  {feedbackError && (
                    <div className="mt-3 flex items-center justify-center gap-2 text-rose-500 font-bold animate-pulse">
                      <AlertCircle className="w-5 h-5" />
                      <span>{feedbackError}</span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-400 rounded-[24px] text-center animate-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-center gap-3 text-emerald-600 mb-4">
                    <CheckCircle2 className="w-8 h-8 flex-none" />
                    <p className="text-xl font-black">{interactiveTask.successMessage}</p>
                  </div>
                  {selectedIndex < TUTORIALS.length - 1 && (
                    <button
                      onClick={nextModule}
                      className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                    >
                      進入下一課 <ArrowRight className="w-5 h-5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-12">
            <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
              <h4 className="font-black text-xl text-slate-900 mb-6 flex items-center gap-3">
                <Info className="w-6 h-6 text-emerald-500" /> 章節要點
              </h4>
              <ul className="space-y-4">
                {tutorial.steps.map((step, i) => (
                  <li key={i} className="flex gap-4 text-slate-600 leading-relaxed items-start">
                    <span className="flex-none w-6 h-6 bg-emerald-500 text-emerald-950 rounded-full flex items-center justify-center text-[10px] font-black mt-1">
                      {i + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
