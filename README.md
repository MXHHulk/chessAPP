# ChessAcademy — 專案結構說明

## 目錄結構

```
src/
├── data/
│   ├── tutorials.js        # 教學課程內容（純資料，無 React）
│   └── tactics.js          # 預設戰術 & 難度等級選項
│
├── hooks/
│   └── useTactics.js       # localStorage 讀寫邏輯
│
├── components/
│   ├── PieceIcon.jsx        # 棋子圖片元件
│   ├── ChessBoard.jsx       # 棋盤元件
│   └── AddTacticModal.jsx   # 新增戰術彈窗
│
├── views/
│   ├── HomeView.jsx         # 首頁
│   ├── TutorialsView.jsx    # 基礎課程頁
│   └── TacticsView.jsx      # 戰術收錄頁
│
└── App.jsx                  # 導覽列 + 路由（只管切換）
```

## 常見維護任務

### 新增教學課程
→ 編輯 `src/data/tutorials.js`，在陣列末尾加入新物件。

### 新增難度等級
→ 編輯 `src/data/tactics.js`，在 `DIFFICULTY_LEVELS` 陣列加入新字串。
→ 同時在 `TacticsView.jsx` 的 `DIFFICULTY_STYLE` 加入對應樣式。

### 修改棋盤樣式
→ 只需編輯 `src/components/ChessBoard.jsx`。

### 修改新增戰術表單
→ 只需編輯 `src/components/AddTacticModal.jsx`。

### 將 localStorage 換成後端 API
→ 只需修改 `src/hooks/useTactics.js`，其他檔案不用動。
