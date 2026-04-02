import { useState, useEffect } from 'react';
import { ChevronRight, Info, RotateCcw } from 'lucide-react';
import { Chess } from 'chess.js';
import { ChessBoard } from '../components/ChessBoard';
import { TUTORIALS } from '../data/tutorials';

// ============================================================
// TutorialsView - 基礎課程頁面
// ============================================================

export const TutorialsView = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const tutorial = TUTORIALS[selectedIndex];
  
  const [game, setGame] = useState(new Chess());
  const [currentFen, setCurrentFen] = useState(tutorial.fen);

  useEffect(() => {
    try {
      const newGame = new Chess(tutorial.fen);
      setGame(newGame);
    } catch {
      // 容錯處理：如果 FEN 不是標準開局，我們至少能顯示
    }
    setCurrentFen(tutorial.fen);
  }, [selectedIndex, tutorial.fen]);

  const handleReset = () => {
    try {
      const newGame = new Chess(tutorial.fen);
      setGame(newGame);
    } catch {}
    setCurrentFen(tutorial.fen);
  };

  const onDrop = (sourceSquare, targetSquare, piece) => {
    try {
      const gameCopy = new Chess(game.fen());
      const move = gameCopy.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: piece[1].toLowerCase() ?? 'q',
      });

      if (move) {
        setGame(gameCopy);
        setCurrentFen(gameCopy.fen());
        return true;
      }
    } catch {
      // 若 FEN 不符合完整規則（如自定義殘局），允許自由移動
      // 這邊可以使用簡易的 FEN 替換或者乾脆依賴 react-chessboard 的非嚴格模式
    }
    return false;
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
            <ChessBoard fen={currentFen} onDrop={onDrop} />
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleReset}
                className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-emerald-600 transition"
              >
                <RotateCcw className="w-3 h-3" /> 重置目前佈局
              </button>
            </div>
          </div>

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
