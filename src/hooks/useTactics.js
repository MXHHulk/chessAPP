import { useState } from 'react';
import { INITIAL_TACTICS } from '../data/tactics';

// ============================================================
// useTactics
// 管理戰術列表的所有狀態與副作用，已依需求改為純靜態資料展示。
// ============================================================
export function useTactics() {
  const [tactics] = useState(INITIAL_TACTICS);

  return { tactics };
}

