import { useState } from 'react';
import { PieceIcon } from './PieceIcon';

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1];

// ============================================================
// ChessBoard
// 純 UI 元件，不含任何業務邏輯。
// props:
//   pieces   - { [addr]: { type, color } }
//   setPieces - 可選，提供時允許互動拖動
//   readOnly  - 禁止點擊互動（預覽用）
// ============================================================
export const ChessBoard = ({ pieces, setPieces, readOnly = false }) => {
  const [selected, setSelected] = useState(null);

  const handleSquareClick = (addr) => {
    if (readOnly) return;

    if (!selected) {
      if (pieces[addr]) setSelected(addr);
      return;
    }

    if (selected === addr) {
      setSelected(null);
      return;
    }

    // 移動棋子
    const next = { ...pieces };
    next[addr] = next[selected];
    delete next[selected];
    setPieces(next);
    setSelected(null);
  };

  return (
    <div className="w-full max-w-[480px] mx-auto aspect-square border-[10px] border-emerald-900 rounded-lg shadow-2xl overflow-hidden bg-emerald-900">
      <div className="grid grid-cols-8 grid-rows-8 h-full">
        {RANKS.map((rank, rIdx) =>
          FILES.map((file, fIdx) => {
            const addr = `${file}${rank}`;
            const piece = pieces[addr];
            const isDark = (rIdx + fIdx) % 2 === 1;
            const isSelected = selected === addr;

            return (
              <div
                key={addr}
                onClick={() => handleSquareClick(addr)}
                className={[
                  isDark ? 'bg-emerald-700' : 'bg-emerald-100',
                  'relative flex items-center justify-center cursor-pointer transition-all',
                  isSelected ? 'ring-inset ring-4 ring-yellow-400 z-10' : 'hover:opacity-90',
                ].join(' ')}
              >
                {fIdx === 0 && (
                  <span className={`absolute left-0.5 top-0.5 text-[10px] font-bold ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                    {rank}
                  </span>
                )}
                {rIdx === 7 && (
                  <span className={`absolute right-0.5 bottom-0.5 text-[10px] font-bold ${isDark ? 'text-emerald-200/50' : 'text-emerald-800/50'}`}>
                    {file}
                  </span>
                )}
                {piece && <PieceIcon type={piece.type} color={piece.color} />}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
