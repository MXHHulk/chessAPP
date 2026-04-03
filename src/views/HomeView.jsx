import { GraduationCap, Lightbulb, Trophy } from 'lucide-react';
import { ChessBoard } from '../components/ChessBoard';
import { TUTORIAL_CATEGORIES } from '../data/tutorials';

// ============================================================
// HomeView - 首頁
// 只負責首頁的版面，導航由父層 App.jsx 的 setView 處理。
// ============================================================

const FEATURES = [
  { icon: <GraduationCap />, title: '系統化課程', text: '從棋盤擺放到複雜的規則，循序漸進。' },
  { icon: <Lightbulb />,    title: '戰術收錄',   text: '看到精彩的殘局？立即記錄下來進行分析。' },
  { icon: <Trophy />,       title: '實戰演練',   text: '互動式棋盤讓您隨時模擬各種走法。' },
];

export const HomeView = ({ setView }) => (
  <div className="py-12 animate-in fade-in slide-in-from-top-4 duration-1000">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-block bg-emerald-100 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-6">
          自製西洋棋學習工具
        </span>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1]">
          從零開始，<br />
          <span className="text-emerald-600 underline decoration-8 decoration-emerald-100 underline-offset-8">成就大師</span>
        </h2>
        <p className="text-lg text-slate-500 mb-10 max-w-lg leading-relaxed">
          這不只是一個教學網頁，這是您的個人化訓練場。學習基礎走法、記錄經典戰術，建立屬於您的開局體系。
        </p>
        <div className="flex flex-wrap gap-4">
          <button onClick={() => setView('tutorials')} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-black shadow-xl shadow-emerald-200 hover:bg-emerald-700 transition transform hover:-translate-y-1">
            開始學習
          </button>
          <button onClick={() => setView('tactics')} className="bg-white text-slate-900 border-2 border-slate-200 px-8 py-4 rounded-2xl font-black hover:bg-slate-50 transition transform hover:-translate-y-1">
            我的戰術
          </button>
        </div>
      </div>

      <div className="hidden lg:block relative">
        <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-full" />
        <div className="relative bg-white p-6 rounded-[32px] shadow-2xl border border-slate-100 rotate-2">
          <ChessBoard fen={TUTORIAL_CATEGORIES[0].items[0].fen} readOnly />
        </div>
      </div>
    </div>

    <div className="grid md:grid-cols-3 gap-8 mt-24">
      {FEATURES.map((f, i) => (
        <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 hover:shadow-xl transition shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
            {f.icon}
          </div>
          <h4 className="text-xl font-black mb-3">{f.title}</h4>
          <p className="text-slate-500 leading-relaxed">{f.text}</p>
        </div>
      ))}
    </div>
  </div>
);
