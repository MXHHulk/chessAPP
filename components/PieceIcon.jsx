// ============================================================
// PieceIcon
// 負責顯示單一棋子圖片，並在本地圖片載入失敗時
// 自動 fallback 至 Lichess CDN。
// ============================================================

const LICHESS_CDN = 'https://lichess1.org/assets/piece/cburnett';

export const PieceIcon = ({ type, color, size = 'w-10 h-10' }) => {
  const prefix = color === 'white' ? 'w' : 'b';
  const typeUpper = type.toUpperCase();
  const fallbackUrl = `${LICHESS_CDN}/${prefix}${typeUpper}.svg`;

  return (
    <div className={`${size} md:w-12 md:h-12 flex items-center justify-center p-0.5 select-none`}>
      <img
        src={`${prefix}${typeUpper}.png`}
        alt={`${color} ${type}`}
        className="w-full h-full object-contain drop-shadow-sm transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        onError={(e) => {
          if (e.target.src !== fallbackUrl) e.target.src = fallbackUrl;
        }}
      />
    </div>
  );
};
