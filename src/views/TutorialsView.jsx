import { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Info, RotateCcw, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { TUTORIAL_CATEGORIES } from '../data/tutorials';

// ============================================================
// TutorialsView - 基礎課程頁面
// ============================================================

export const TutorialsView = () => {
  // 將分類結構展平，方便按順序切換 "下一課"
  const flattenedTutorials = TUTORIAL_CATEGORIES.flatMap(c => c.items);
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tutorial = flattenedTutorials[selectedIndex];

  // 尋找當前課程所屬的類別 ID
  const initialCategory = TUTORIAL_CATEGORIES.find(c => c.items.some(item => item.id === tutorial.id))?.id;
  const [expandedCategory, setExpandedCategory] = useState(initialCategory || TUTORIAL_CATEGORIES[0].id);
  
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
    // 切換課程時，自動展開該課程所在的類別
    const newCategory = TUTORIAL_CATEGORIES.find(c => c.items.some(item => item.id === tutorial.id))?.id;
    if (newCategory) setExpandedCategory(newCategory);
    // eslint-disable-next-line
  }, [selectedIndex, tutorial.fen]);

  // 設定錯誤提示的自動清除
  useEffect(() => {
    if (feedbackError) {
      const timer = setTimeout(() => {
        setFeedbackError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [feedbackError]);

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
    if (isSuccess || tutorial.readOnly) return; 

    const piece = game.get(square);
    if (!piece) {
       setOptionSquares({});
       return;
    }
    // 如果課程設定了 continuousColor，且點擊的棋子顏色不符合，則不顯示移動選項也不允許移動
    if (tutorial.continuousColor && piece.color !== tutorial.continuousColor) {
      setOptionSquares({});
      return;
    }

    let searchGame = game;
    // 讓新手可以看到非當前回合棋子的走法，或是允許連續同一方移動
    if (piece.color !== game.turn()) {
      const fenTokens = game.fen().split(' ');
      fenTokens[1] = piece.color;
      fenTokens[3] = '-'; 
      try {
        searchGame = new Chess(fenTokens.join(' '));
      } catch (e) {
        searchGame = game; 
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
          (move.flags.includes('c') || move.flags.includes('e'))
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
      
      // 若該移動會導致升變（走到底線的兵），則這裡只負責清除高亮狀態
      // 因為 react-chessboard 原生的點擊移動不支援自訂升變彈出，但我們可以依賴 onPromotionPieceSelect
      // * 註：雖然可以處理，但若要維持簡單的嚴格比對，我們將點擊升變預設為 q 再交給邏輯判斷是否過關
      const isPawn = game.get(selectedSquare)?.type === 'p';
      const isPromotionRank = square[1] === '8' || square[1] === '1';
      
      if (isPawn && isPromotionRank && interactiveTask) {
        // 如果這個任務要求特定升變，這裡若直接點擊只能預設 q，如果出錯就會彈回
        // 為了避免問題，我們仍然將 Q 傳下去，若玩家想選別的，建議他用拖曳的
      }
      
      const moveResult = handleLogicMove(selectedSquare, square, 'q'); 
      if (moveResult) {
        setSelectedSquare('');
        setOptionSquares({});
        return;
      }
    }

    const piece = game.get(square);
    if (piece) {
      // 點擊己方或敵方棋子，顯示可行步數
      setSelectedSquare(square);
      getMoveOptions(square);
    } else {
      // 點擊非法空格，立刻清除選取與高亮狀態
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
    
    const isPawn = piece[1] === 'P'; // 判斷是否為 'wP' 或是 'bP'
    const isPromotionRank = targetSquare[1] === '8' || targetSquare[1] === '1';
    
    if (isPawn && isPromotionRank) {
      // 發生升變時，中止立即移動，交由 react-chessboard 的 onPromotionPieceSelect 來處理
      return true;
    }
    
    return handleLogicMove(sourceSquare, targetSquare, piece[1]?.toLowerCase() || 'q');
  };

  const onPromotionPieceSelect = (piece, sourceSquare, targetSquare) => {
    const promotionPiece = piece[1]?.toLowerCase() || 'q';
    return handleLogicMove(sourceSquare, targetSquare, promotionPiece);
  };

  const handleLogicMove = (sourceSquare, targetSquare, promotionP) => {
    if (isSuccess) return false;
    setFeedbackError('');

    let gameCopy = new Chess(game.fen());
    const piece = gameCopy.get(sourceSquare);

    // 如果教學有設定只允許某一方移動，阻止另一方的移動
    if (tutorial.continuousColor && piece && piece.color !== tutorial.continuousColor) {
      return false;
    }

    // 動態調整回合，讓非正常開局或連續同一方移動成為可能
    if (piece && piece.color !== gameCopy.turn()) {
      const fenTokens = gameCopy.fen().split(' ');
      fenTokens[1] = piece.color;
      fenTokens[3] = '-'; // 取消過路兵，避免產生不合法的 FEN
      try {
        gameCopy = new Chess(fenTokens.join(' '));
      } catch (e) {
        // 若發生錯誤，退回使用原始狀態
      }
    }

    if (interactiveTask) {
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
    if (selectedIndex < flattenedTutorials.length - 1) {
      setSelectedIndex(selectedIndex + 1);
      // 清理選單捲軸狀態
      const listContainer = document.getElementById('tutorial-list');
      if (listContainer) {
        const activeBtn = document.getElementById(`tutorial-btn-${selectedIndex + 1}`);
        if (activeBtn) activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  };

  return (
    <div className="animate-in slide-in-from-right duration-500 h-[calc(100vh-140px)] min-h-[600px] flex overflow-hidden">
      
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
        <aside className="w-[25%] flex flex-col gap-4 pr-2 overflow-y-auto custom-scrollbar pb-4" id="tutorial-list">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest ml-2 mb-1 flex-shrink-0">
            教學模組
          </h3>
          
          {TUTORIAL_CATEGORIES.map((category) => {
            const isExpanded = expandedCategory === category.id;
            
            return (
              <div key={category.id} className="flex flex-col gap-1 flex-shrink-0">
                <button 
                  onClick={() => setExpandedCategory(isExpanded ? '' : category.id)}
                  className="flex items-center justify-between px-3 py-3 rounded-[16px] hover:bg-slate-100 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-700">{category.title}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {isExpanded && (
                  <div className="flex flex-col gap-2 mt-1 px-1">
                    {category.items.map((t) => {
                      const globalIdx = flattenedTutorials.findIndex(item => item.id === t.id);
                      const isSelected = selectedIndex === globalIdx;
                      
                      return (
                        <button
                          id={`tutorial-btn-${globalIdx}`}
                          key={t.id}
                          onClick={() => setSelectedIndex(globalIdx)}
                          className={[
                            'w-full text-left p-4 rounded-[20px] transition-all border-2 flex items-center justify-between group flex-shrink-0',
                            isSelected
                              ? 'bg-white border-emerald-500 shadow-md scale-[1.02]'
                              : 'bg-white/50 border-transparent hover:border-slate-300',
                          ].join(' ')}
                        >
                          <div>
                            <span className="block text-[10px] font-black text-emerald-600 mb-0.5">
                              MODULE {String(globalIdx + 1).padStart(2, '0')}
                            </span>
                            <span className={`font-bold text-sm ${isSelected ? 'text-slate-900' : 'text-slate-500'}`}>
                              {t.shortTitle}
                            </span>
                          </div>
                          <ChevronRight className={`w-4 h-4 transition-transform flex-shrink-0 ${isSelected ? 'text-emerald-500 rotate-90' : 'text-slate-300 group-hover:translate-x-1'}`} />
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
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
                showPromotionDialog={true}
                onPromotionPieceSelect={onPromotionPieceSelect}
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
                  {/* 使用隱藏空間保留高度，避免文字閃爍跳動 */}
                  <div className={`mt-3 flex items-center justify-center gap-2 text-rose-500 font-bold transition-opacity ${feedbackError ? 'opacity-100 animate-pulse' : 'opacity-0 h-0 overflow-hidden mt-0'}`}>
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">{feedbackError}</span>
                  </div>
                </div>
              ) : (
                <div className="p-5 bg-emerald-50 border-2 border-emerald-400 rounded-[24px] text-center animate-in zoom-in-95 duration-500">
                  <div className="flex items-center justify-center gap-2 text-emerald-600 mb-3">
                    <CheckCircle2 className="w-6 h-6 flex-none" />
                    <p className="text-lg font-black">{interactiveTask.successMessage}</p>
                  </div>
                  {selectedIndex < flattenedTutorials.length - 1 && (
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
