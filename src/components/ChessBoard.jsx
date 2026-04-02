import { Chessboard } from 'react-chessboard';

// ============================================================
// ChessBoard.jsx
// 封裝 react-chessboard，提供統一的棋盤外觀。
// props:
//   fen        - FEN 字串表示的棋盤狀態
//   readOnly   - 是否為唯讀模式 (不允許移動棋子)
//   onDrop     - 移動棋子成功的回調處理 (若有提供)
// ============================================================

export const ChessBoard = ({ fen, readOnly = false, onDrop }) => {
  return (
    <div className="w-full aspect-square border-[10px] border-emerald-950 rounded-lg overflow-hidden shadow-2xl relative bg-[#739552]">
      <Chessboard 
        position={fen}
        arePiecesDraggable={!readOnly}
        onPieceDrop={onDrop}
        customDarkSquareStyle={{ backgroundColor: '#739552' }}
        customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
      />
    </div>
  );
};
