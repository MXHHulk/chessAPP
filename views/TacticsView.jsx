import { useState } from 'react';
import { Plus, Target, Trash2 } from 'lucide-react';
import { ChessBoard } from '../components/ChessBoard';
import { AddTacticModal } from '../components/AddTacticModal';

// ============================================================
// TacticsView - 戰術收錄頁面
// props:
//   tactics      - 戰術陣列（來自 useTactics hook）
//   addTactic    - 新增戰術的函式
//   deleteTactic - 刪除戰術的函式
// ============================================================

const DIFFICULTY_STYLE = {
  '初級': 'bg-blue-100 text-blue-700',
  '中級': 'bg-orange-100 text-orange-700',
  '高級': 'bg-red-100 text-red-700',
};

export const TacticsView = ({ tactics, addTactic, deleteTactic }) => {
  const [showModal, setShowModal] = useState(false);

  const handleSave = (tactic) => {
    addTactic(tactic);
    setShowModal(false);
  };

  return (
    <div className="animate-in slide-in-from-bottom duration-500">
      {/* 頁首 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-5xl font-black text-slate-900 mb-4">戰術收錄簿</h2>
          <p className="text-lg text-slate-500 font-medium">點擊戰術進行分析，或新增您在實戰中遇到的難題。</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition flex items-center gap-3"
        >
          <Plus className="w-6 h-6" /> 新增戰術位置
        </button>
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
              onDelete={(e) => { e.stopPropagation(); deleteTactic(t.id); }}
            />
          ))}
        </div>
      )}

      {/* 新增戰術彈窗 */}
      {showModal && (
        <AddTacticModal onSave={handleSave} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

// ---- 子元件：單張戰術卡片 ----
const TacticCard = ({ tactic, onDelete }) => (
  <div className="bg-white rounded-[32px] overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all group cursor-pointer">
    <div className="bg-emerald-950 h-64 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="scale-[0.55] transition-transform group-hover:scale-[0.6]">
        <ChessBoard pieces={tactic.pieces} readOnly />
      </div>
      <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <span className="bg-white text-emerald-950 px-6 py-2 rounded-full font-black text-sm">查看詳情</span>
      </div>
      <button
        onClick={onDelete}
        className="absolute top-4 right-4 bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition opacity-0 group-hover:opacity-100 shadow-lg"
      >
        <Trash2 className="w-4 h-4" />
      </button>
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
