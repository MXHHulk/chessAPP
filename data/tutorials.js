// ============================================================
// 教學內容資料
// 新增課程：在此陣列末尾加入一個新物件即可
// ============================================================

export const TUTORIALS = [
  {
    id: 'setup',
    title: '第一課：棋盤與初始化',
    description: '正確的擺放是比賽的開始。請記住：右下角必須是白色格子。',
    steps: [
      '棋盤橫線叫「行」(Rank)，用數字 1-8 表示。',
      '棋盤直線叫「列」(File)，用字母 a-h 表示。',
      '王后 (Queen) 站在顏色與自己相同的格子上。',
      '白棋永遠先行。',
    ],
    layout: {
      'd1': { type: 'q', color: 'white' }, 'e1': { type: 'k', color: 'white' },
      'd8': { type: 'q', color: 'black' }, 'e8': { type: 'k', color: 'black' },
      'a1': { type: 'r', color: 'white' }, 'h1': { type: 'r', color: 'white' },
      'a8': { type: 'r', color: 'black' }, 'h8': { type: 'r', color: 'black' },
    },
  },
  {
    id: 'king',
    title: '第二課：國王的力量',
    description: '國王雖然重要，但移動能力有限。',
    steps: [
      '國王可以向任何方向移動「一格」。',
      '國王不能移動到會被對方棋子攻擊的格子上。',
      '特殊走法：王車易位 (Castling)。',
    ],
    layout: {
      'e4': { type: 'k', color: 'white' },
      'd5': { type: 'p', color: 'black' },
      'f5': { type: 'p', color: 'black' },
    },
  },
  {
    id: 'knight',
    title: '第三課：騎士的跳躍',
    description: '它的移動軌跡呈「L」形。',
    steps: [
      '騎士移動為兩格加一格。',
      '騎士每次移動必定會改變落點格子的顏色。',
      '騎士適合在封閉的局面中作戰。',
    ],
    layout: {
      'd4': { type: 'n', color: 'white' },
      'c6': { type: 'p', color: 'black' },
      'e6': { type: 'p', color: 'black' },
    },
  },
];
