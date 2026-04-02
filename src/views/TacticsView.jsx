import { Target } from 'lucide-react';
import { ChessBoard } from '../components/ChessBoard';

// ============================================================
// TacticsView - 戰術收錄頁面
// props:
//   tactics - 戰術陣列（來自 useTactics hook）
// ============================================================

const DIFFICULTY_STYLE = {
  '初級': 'bg-blue-100 text-blue-700',
  '中級': 'bg-orange-100 text-orange-700',
  '高級': 'bg-red-100 text-red-700',
};

export const TacticsView = ({ tactics }) => {
  return (
    <div className="animate-in slide-in-from-bottom duration-500">
      {/* 頁首 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-4">戰術收錄簿</h2>
          <p className="text-lg text-slate-500 font-medium">觀摩並學習在實戰中遇到的難題，或從題庫中新增。新增戰術請至 `tactics.js` 中新增模板內容。</p>
        </div>
      </div>

      {/* 空白提示 */}
      {tactics.length === 0 ? (
        <div className="bg-white rounded-[40px] p-20 text-center border border-dashed border-slate-300">
          <Target className="w-16 h-16 text-slate-200 mx-auto mb-6" />
          <p className="text-slate-400 font-bold">目前還沒有收藏任何戰術。</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tactics.map((t) => (
            <TacticCard
              key={t.id}
              tactic={t}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// ---- 子元件：單張戰術卡片 ----
const TacticCard = ({ tactic }) => (
  <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all group cursor-pointer">
    <div className="bg-emerald-950 h-64 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="w-full h-full max-w-[200px] flex items-center justify-center transition-transform group-hover:scale-105">
        {/* 指向 fen 屬性，並且是唯讀 */}
        <ChessBoard fen={tactic.fen} readOnly />
      </div>
      <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <span className="bg-white text-emerald-950 px-6 py-2 rounded-full font-black text-sm shadow-xl">挑戰此局</span>
      </div>
    </div>

    <div className="p-8">
      <div className="flex justify-between items-start mb-4">
        <h4 className="font-black text-2xl text-slate-900 group-hover:text-emerald-600 transition">{tactic.name}</h4>
        <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${DIFFICULTY_STYLE[tactic.difficulty] ?? 'bg-slate-100 text-slate-600'}`}>
          {tactic.difficulty}
        </span>
      </div>
      <p className="text-slate-500 text-sm leading-relaxed line-clamp-2">{tactic.description}</p>
    </div>
  </div>
);
