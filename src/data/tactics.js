// ============================================================
// 預設戰術資料（僅作初始值，實際資料儲存於 localStorage）
// 新增預設戰術：在此陣列末尾加入一個新物件即可
// ============================================================

export const INITIAL_TACTICS = [
  {
    id: 1,
    name: '悶殺 (Smothered Mate)',
    description: '騎士利用對方國王被己方棋子困住的機會，給予致命一擊。',
    difficulty: '中級',
    pieces: {
      'h8': { type: 'k', color: 'black' },
      'g8': { type: 'r', color: 'black' },
      'g7': { type: 'p', color: 'black' },
      'h7': { type: 'p', color: 'black' },
      'f7': { type: 'n', color: 'white' },
    },
  },
];

// 難度等級選項（新增難度時，在此陣列加入即可）
export const DIFFICULTY_LEVELS = ['初級', '中級', '高級'];
