import { useState } from 'react';
import { Save, Target } from 'lucide-react';
import { DIFFICULTY_LEVELS } from '../data/tactics';

// ============================================================
// AddTacticModal - 新增戰術的彈出視窗
// props:
//   onSave(tactic) - 儲存回呼
//   onClose()      - 關閉回呼
// ============================================================

const EMPTY_FORM = { name: '', description: '', difficulty: '初級' };

export const AddTacticModal = ({ onSave, onClose }) => {
  const [form, setForm] = useState(EMPTY_FORM);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-[40px] w-full max-w-lg p-10 shadow-2xl animate-in zoom-in duration-300 border border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-3xl font-black text-slate-900">收錄新戰術</h3>
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl">
            <Target className="w-6 h-6" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 戰術名稱 */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              戰術名稱
            </label>
            <input
              required
              type="text"
              value={form.name}
              onChange={set('name')}
              placeholder="例如：底線將死"
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:border-emerald-500 outline-none transition font-bold"
            />
          </div>

          {/* 戰術描述 */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              戰術描述
            </label>
            <textarea
              value={form.description}
              onChange={set('description')}
              placeholder="記錄這個位置的關鍵走法或獲勝邏輯..."
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl h-32 focus:border-emerald-500 outline-none transition resize-none font-medium text-slate-600"
            />
          </div>

          {/* 難度選擇 */}
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
              難度等級
            </label>
            <div className="grid grid-cols-3 gap-3">
              {DIFFICULTY_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, difficulty: level }))}
                  className={[
                    'py-4 rounded-2xl font-black text-sm border-2 transition',
                    form.difficulty === level
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200',
                  ].join(' ')}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-4 pt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-5 rounded-2xl hover:bg-slate-50 transition text-slate-400 font-black uppercase text-xs tracking-widest"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-5 bg-emerald-600 text-white rounded-2xl hover:bg-emerald-700 transition font-black shadow-xl shadow-emerald-200 flex items-center justify-center gap-2 uppercase text-xs tracking-widest"
            >
              <Save className="w-5 h-5" /> 儲存位置
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
