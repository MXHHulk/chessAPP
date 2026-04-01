import { useState, useEffect } from 'react';
import { INITIAL_TACTICS } from '../data/tactics';

const STORAGE_KEY = 'chess-tactics';

// ============================================================
// useTactics
// 管理戰術列表的所有狀態與副作用，與 UI 完全解耦。
// 若未來換成後端 API，只需修改此檔案。
// ============================================================
export function useTactics() {
  const [tactics, setTactics] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_TACTICS;
    } catch {
      return INITIAL_TACTICS;
    }
  });

  // 同步至 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tactics));
  }, [tactics]);

  const addTactic = (tactic) => {
    setTactics((prev) => [{ ...tactic, id: Date.now(), pieces: {} }, ...prev]);
  };

  const deleteTactic = (id) => {
    setTactics((prev) => prev.filter((t) => t.id !== id));
  };

  return { tactics, addTactic, deleteTactic };
}
