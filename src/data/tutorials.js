// ============================================================
// 教學內容資料
// ============================================================
//
// 新增教學模板：
// 將以下模板複製並貼到陣列最後面，修改參數即可：
// {
//   id: 'custom_id',
//   title: '第X課：標題',
//   shortTitle: '簡短標題',
//   description: '簡短敘述',
//   steps: [
//     '第一條要點。',
//     '第二條要點。'
//   ],
//   fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', // 棋盤的 FEN 字串
// }
// ============================================================

export const TUTORIAL_CATEGORIES = [
  {
    id: 'basics',
    title: '新手入門',
    items: [
      {
        id: 'setup',
        title: '西洋棋的開端',
        shortTitle: '盤面開端',
        description: '正確的擺放是比賽的開始。請記住：右下角必須是白色格子。',
        steps: [
          '棋盤橫線叫「行」(Rank)，用數字 1-8 表示。',
          '棋盤直線叫「列」(File)，用字母 a-h 表示。',
          '王后 (Queen) 站在顏色與自己相同的格子上。',
          '白棋永遠先行。',
        ],
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
      }
    ]
  },
  {
    id: 'pieces',
    title: '棋子的移動',
    items: [
      {
        id: 'king',
        title: '第一課：尊貴但脆弱的「靈魂」—— 國王',
        shortTitle: '國王',
        description: '國王雖然重要，但移動能力有限，必須好好保護。',
        steps: [
          '國王可以向任何方向移動「一格」。',
          '國王不能移動到會被對方棋子攻擊的格子上。',
        ],
        fen: '8/8/8/8/2K5/8/8/8 w - - 0 1',
        interactiveTask: {
          instruction: '輪到你的回合！試著將國王向前移動一步 (c4 到 c5)。',
          expectedMoves: [{ from: 'c4', to: 'c5' }],
          successMessage: '太棒了！這就是國王的移動方式。',
        }
      },
      {
        id: 'rook',
        title: '第二課：直線上的王者 —— 城堡',
        shortTitle: '城堡',
        description: '簡單、粗暴、高效。這就是防守與進攻的重砲。',
        steps: [
          '城堡可以沿著直線移動任意格數。',
          '城堡不能越過其他棋子。',
        ],
        fen: '8/1p3p2/8/8/8/1p3R2/8/8 w - - 0 1',
        interactiveTask: {
          instruction: '試著利用城堡吃掉黑方的兵 (f3 到 f7)！',
          expectedMoves: [{ from: 'f3', to: 'f7' }],
          successMessage: '漂亮！城堡在空曠的直線上威力無比。',
        }
      },
      {
        id: 'bishop',
        title: '第三課：穿透力極強的「狙擊手」 —— 主教',
        shortTitle: '主教',
        description: '斜線上的舞者，控制全局的關鍵',
        steps: [
          '主教只能沿著斜線移動任意格數。',
          '主教不能越過其他棋子。',
        ],
        fen: '8/3p4/7p/p7/4p3/7p/1p6/2B5 w - - 0 1',
        interactiveTask: {
          instruction: '我們來試試斜線的威力，用主教堂堂正正地吃掉黑方的兵 (c1 到 h6)！',
          expectedMoves: [{ from: 'c1', to: 'h6' }],
          successMessage: '幹得好！記得主教只能在與它相同的顏色格子上移動喔。',
        }
      },
      {
        id: 'queen',
        title: '第四課：戰場上最強大的女神 —— 王后',
        shortTitle: '王后',
        description: '新手最愛她，但也最怕失去她。',
        steps: [
          '王后可以沿著直線或斜線移動任意格數。',
          '王后不能越過其他棋子。',
        ],
        fen: '8/5p2/8/8/8/1p3Q2/8/8 w - - 0 1',
        interactiveTask: {
          instruction: '展現王后的強大火力，直接斜向消滅黑方的兵吧 (f3 到 b7)！',
          expectedMoves: [{ from: 'f3', to: 'b7', alternative: {from: 'f3', to:'f7'} }],
          successMessage: '太強了吧！這就是為什麼所有人都喜歡王后。',
        }
      },
      {
        id: 'knight',
        title: '第五課：不按牌理出牌的跳躍者 —— 騎士',
        shortTitle: '騎士',
        description: '棋盤上最獨特的存在，唯一能「越過」其他棋子的兵種。',
        steps: [
          '它的移動軌跡呈「L」形。',
          '騎士每次移動必定會改變落點格子的顏色。',
        ],
        fen: '8/8/8/2p1p3/8/3N4/8/8 w - - 0 1',
        interactiveTask: {
          instruction: '騎士可以跳過棋子。試著用騎士吃掉左上方的兵 (d3 到 c5)！',
          expectedMoves: [{ from: 'd3', to: 'c5' }],
          successMessage: '神出鬼沒！騎士的 L 形走法在擁擠的戰場上非常吃香。',
        }
      },
      {
        id: 'pawn',
        title: '第六課：勇敢的「無名英雄」—— 兵',
        shortTitle: '兵',
        description: '兵雖然弱小，但它是棋盤上數量最多的棋子，也是唯一能「升變」的棋子。',
        steps: [
          '兵只能向前移動，不能後退。',
          '兵第一次移動時，可以選擇向前移動一格或兩格。',
          '兵只能斜線吃子。',
        ],
        fen: '8/8/3p4/8/8/8/4P3/8 w - - 0 1',
        interactiveTask: {
          instruction: '這是兵的第一步，大膽地前進兩步吧 (e2 到 e4)！',
          expectedMoves: [{ from: 'e2', to: 'e4' }],
          successMessage: '勇敢的第一步！記得之後兵就只能每次前進一格了喔。',
        }
      }
    ]
  },
  {
    id: 'rules',
    title: '特殊規則與勝負',
    items: [
      {
        id: 'promotion',
        title: '第七課：兵的「升變」',
        shortTitle: '兵的升變',
        description: '殘局階段逆轉勝負的關鍵策略。',
        steps: [
          '兵到達底線的同時必須馬上完成升變。',
          '可以變換成除了國王以外的任何棋子（通常變為王后）。',
        ],
        fen: '8/5P2/8/8/8/8/8/8 w - - 0 1',
        interactiveTask: {
          instruction: '將兵推到底線 (f7 到 f8)，並選擇升變為王后！',
          expectedMoves: [{ from: 'f7', to: 'f8', promotion: 'q' }],
          successMessage: '麻雀變鳳凰！這就是殘局中反敗為勝的終極武器。',
        }
      },
      {
        id: 'en_passant',
        title: '第八課：兵的「吃過路兵」',
        shortTitle: '吃過路兵',
        description: '兵的特殊吃子方式。',
        steps: [
          '當對方兵第一次移動兩格時，如果你的兵在它的旁邊，你可以吃掉它。',
        ],
        fen: '8/8/8/2Pp4/8/8/8/8 w - d6 0 1',
        interactiveTask: {
          instruction: '對方剛才推進了 d 列的兵。趕快使出「吃過路兵」，將兵移到左上角 (c5 到 d6)！',
          expectedMoves: [{ from: 'c5', to: 'd6' }],
          successMessage: '幹得好！這一招經常能讓新手對手大吃一驚。',
        }
      },
      {
        id: 'castling',
        title: '第九課：國王的「特殊移動」—— 易位',
        shortTitle: '王車易位',
        description: '唯一一次可以同時移動國王與城堡的機會，目的是保護國王並讓城堡進入戰場。',
        steps: [
          '國王與城堡在整局棋中都不能移動過。',
          '國王與城堡之間不能有其他棋子。',
          '國王不能處於被攻擊的狀態，也不能越過被攻擊的格子。',
        ],
        fen: '8/8/8/8/8/8/8/R3K2R w KQ - 0 1',
        interactiveTask: {
          instruction: '我們來進行「短易位」。將國王移動兩格 (e1 到 g1)，城堡會自動躍過它！',
          expectedMoves: [{ from: 'e1', to: 'g1' }],
          successMessage: '國王進入了安全的堡壘！現在你可以放心進攻了。',
        }
      },
      {
        id: 'check',
        title: '第十課：將軍',
        shortTitle: '將軍',
        description: '對方的棋子正在威脅你的國王。',
        steps: [
          '你必須立即解除威脅，解除威脅的方式有三種：',
          '1. 移動國王到安全的格子。',
          '2. 用其他棋子擋住威脅。',
          '3. 吃掉威脅源。',
        ],
        fen: '8/4k3/8/8/4R3/8/2K5/8 b - - 0 1',
        interactiveTask: {
          instruction: '白方的城堡正在「將軍」！趕緊將黑方的國王移動到安全的地方 (比如 e7 到 d7)。',
          expectedMoves: [{ from: 'e7', to: 'd7' }],
          successMessage: '危機解除！永遠要對國王的安全保持警覺。',
        }
      },
      {
        id: 'checkmate',
        title: '第十一課：將殺',
        shortTitle: '將殺',
        description: '將殺是贏得比賽的方式。',
        steps: [
          '國王被威脅，且無法逃跑、擋住或吃掉威脅源。這時比賽結束。',
        ],
        fen: '2R2k2/8/5K2/8/8/8/8/8 w - - 0 1',
      },
      {
        id: 'stalemate',
        title: '第十二課：逼和',
        shortTitle: '逼和',
        description: '不輸棋也是一種贏。',
        steps: [
          '國王沒有被將軍，但無法移動到任何安全的格子。這時比賽結束。',
        ],
        fen: '7k/7P/7K/8/8/8/8/8 w - - 0 1',
      }
    ]
  }
];
