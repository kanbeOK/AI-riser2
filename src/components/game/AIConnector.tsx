import { useEffect } from 'react';
import { GameState, GameAction } from '../../game/types';

export function AIConnector({ state, dispatch }: { state: GameState, dispatch: React.Dispatch<GameAction> }) {
  useEffect(() => {
    if (state.status === 'awaiting_ai' && state.currentCaseId) {
      let isMounted = true;
      
      const lastDecision = state.decisions.length > 0 ? state.decisions[state.decisions.length - 1] : null;
      const userAction = lastDecision?.actionId || 'reply';
      const userMessage = state.messageHistory.length > 0 && state.messageHistory[state.messageHistory.length - 1]?.sender === 'player' 
        ? state.messageHistory[state.messageHistory.length - 1]?.text 
        : undefined;
      
      const history = state.messageHistory.map(m => ({
        role: m.sender === 'player' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      fetch('/api/scenarios/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: state.currentCaseId,
          userAction,
          userMessage,
          history
        })
      })
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        if (data.source === 'deterministic_fallback' || data.error) {
          dispatch({ 
            type: 'APPLY_FALLBACK_RESPONSE', 
            payload: { message: data.message || data.error?.message || "Lỗi kết nối", pressureDelta: 10 } 
          });
        } else {
          dispatch({ 
            type: 'APPLY_AI_RESPONSE', 
            payload: { message: data.message, pressureDelta: data.pressureTactic ? 5 : 0 } 
          });
        }
      })
      .catch(err => {
        if (!isMounted) return;
        dispatch({ 
          type: 'APPLY_FALLBACK_RESPONSE', 
          payload: { message: "Không thể kết nối đến máy chủ. Hãy dùng tính năng chặn/báo cáo.", pressureDelta: 0 } 
        });
      });

      return () => { isMounted = false; };
    }
  }, [state.status, state.currentCaseId, state.decisions, state.messageHistory, dispatch]);

  return null;
}
