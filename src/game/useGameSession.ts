import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, INITIAL_STATE } from './engine';
import { loadGameState, saveGameState, clearGameState } from './storage';

export function useGameSession() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE, (initial) => {
    const loaded = loadGameState();
    return loaded ? loaded : initial;
  });

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  // Trigger delayed consequences if time has passed
  useEffect(() => {
    if (state.status === 'playing' && state.pendingConsequences.length > 0) {
        const [h, m] = state.currentTime.split(":").map(Number);
        const currentMinutes = h * 60 + m;
        
        for (const consequence of state.pendingConsequences) {
           if (currentMinutes >= consequence.triggerAfterMinutes) {
               dispatch({ type: 'TRIGGER_CONSEQUENCE', payload: { caseId: consequence.caseId, sceneId: consequence.sceneId } });
               break; // Only trigger one at a time to allow UI to render
           }
        }
    }
  }, [state.currentTime, state.status, state.pendingConsequences]);

  const reset = useCallback(() => {
    clearGameState();
    dispatch({ type: 'RESET_RUN' });
  }, []);

  return { state, dispatch, reset };
}
