import { useState } from 'react';
import { BookOpen, Sword, Target } from 'lucide-react';
import { HomeView }      from './views/HomeView';
import { TutorialsView } from './views/TutorialsView';
import { TacticsView }   from './views/TacticsView';
import { useTactics }    from './hooks/useTactics';

// ============================================================
// App.jsx
// 只負責：導覽列渲染 + 路由切換 + 將 hook 資料傳給對應 View。
// 不含任何業務邏輯，修改頁面請前往 src/views/。
// ============================================================

const NAV_ITEMS = [
  { id: 'tutorials', label: '基礎課程', icon: <BookOpen className="w-4 h-4" /> },
  { id: 'tactics',   label: '戰術收錄', icon: <Target   className="w-4 h-4" /> },
];

export default function App() {
  const [view, setView]     = useState('home');
  const { tactics, addTactic, deleteTactic } = useTactics();

  return (
    <div className="min-h-screen bg-stone-100 text-slate-800 font-sans selection:bg-emerald-200">

      {/* 導覽列 */}
      <nav className="bg-emerald-950 text-white shadow-2xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-18 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <div className="bg-emerald-500 p-2 rounded-xl rotate-3 group-hover:rotate-0 transition-transform shadow-lg">
              <Sword className="w-6 h-6 text-emerald-950" />
            </div>
            <h1 className="text-xl font-black tracking-tight uppercase">
              Chess<span className="text-emerald-400">Academy</span>
            </h1>
          </div>

          <div className="flex bg-emerald-900/50 p-1 rounded-2xl border border-emerald-800">
            {NAV_ITEMS.map(({ id, label, icon }) => (
              <button
                key={id}
                onClick={() => setView(id)}
                className={[
                  'px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 font-bold text-sm',
                  view === id
                    ? 'bg-emerald-500 text-emerald-950 shadow-md'
                    : 'hover:text-emerald-300',
                ].join(' ')}
              >
                {icon} {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 主內容 */}
      <main className="max-w-6xl mx-auto p-6 md:p-10">
        {view === 'home'      && <HomeView setView={setView} />}
        {view === 'tutorials' && <TutorialsView />}
        {view === 'tactics'   && (
          <TacticsView
            tactics={tactics}
            addTactic={addTactic}
            deleteTactic={deleteTactic}
          />
        )}
      </main>

      {/* 頁尾 */}
      <footer className="mt-24 bg-emerald-950 text-white/40 py-20 border-t border-emerald-900">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="bg-emerald-900 w-16 h-16 rounded-3xl flex items-center justify-center mx-auto mb-8">
            <Sword className="w-8 h-8 text-emerald-500" />
          </div>
          <p className="font-black text-white text-lg tracking-widest uppercase mb-2">ChessAcademy</p>
          <p className="text-sm max-w-xs mx-auto leading-relaxed">您的專屬西洋棋學習夥伴。支援自定義圖標與戰術數據持久化存儲。</p>
          <div className="mt-12 h-px bg-emerald-900 w-full max-w-md mx-auto" />
          <p className="mt-8 text-[10px] font-black uppercase tracking-[0.2em]">Designed for Chess Enthusiasts</p>
        </div>
      </footer>
    </div>
  );
}
