import { useReducer, useEffect, useCallback } from 'react';
import { gameReducer, INITIAL_STATE } from './engine';
import { loadGameState, saveGameState, clearGameState } from './storage';
import { GameAction } from './types';

export function useGameSession() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE, (initial) => {
    const loaded = loadGameState();
    return loaded ? loaded : initial;
  });

  useEffect(() => {
    saveGameState(state);
  }, [state]);

  const reset = useCallback(() => {
    clearGameState();
    dispatch({ type: 'RESET_RUN' });
  }, []);

  return { state, dispatch, reset };
}
