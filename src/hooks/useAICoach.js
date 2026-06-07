import { useState, useRef } from 'react';

export const useAICoach = () => {
  const [aiFeedback, setAiFeedback] = useState('歡迎來到西洋棋教室！請下第一步棋，我會為你分析。');
  const [isLoading, setIsLoading] = useState(false);
  
  // 👉 剛剛漏掉的核心：宣告一個盒子來裝「煞車遙控器」
  const abortControllerRef = useRef(null);

  const askCoach = async (fen, lastMove) => {
    
    // 如果有舊的請求還在跑，就按下煞車中斷它
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // 為這一次的新請求，換一個新的煞車遙控器
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setAiFeedback('教練思考中...');
    
    try {
      const response = await fetch('http://localhost:5000/api/analyze_move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // 把 lastMove 一起包進 JSON 傳給後端
        body: JSON.stringify({ fen, last_move: lastMove }),
        signal: abortControllerRef.current.signal // 把遙控器綁定到這個請求上
      });
      
      if (!response.ok) throw new Error('API 請求失敗');
      
      const data = await response.json();
      setAiFeedback(data.teaching_text);
      
    } catch (error) {
      // 👉 判斷錯誤來源：如果是我們自己按下煞車造成的，就安靜忽略它
      if (error.name === 'AbortError') {
        console.log('玩家連續下棋，已中斷舊請求');
      } else {
        console.error('AI 請求發生錯誤:', error);
        setAiFeedback('哎呀，教練暫時連線異常，請確認後端與 Ollama 是否有啟動。');
      }
    } finally {
      // 👉 確保只有最新的一次請求跑完，才可以解除讀取狀態
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
        setIsLoading(false);
      }
    }
  };
  const resetCoach = () => {
    // 如果教練還在連線思考，強制中斷他
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    // 恢復初始文字與狀態
    setAiFeedback("歡迎來到西洋棋教室！請下第一步棋，我會為你分析。");
    setIsLoading(false);
  };

  // 👉 記得把 resetCoach 一併回傳出去
  return { aiFeedback, isLoading, askCoach, resetCoach };
};