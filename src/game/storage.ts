import { GameState } from './types';

const SAVE_KEY = 'phanh_game_state_v1';
const HISTORY_KEY = 'phanh_run_history_v1';

export function saveGameState(state: GameState) {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save state", e);
  }
}

export function loadGameState(): GameState | null {
  try {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return null;
    return JSON.parse(data) as GameState;
  } catch (e) {
    console.error("Failed to load state", e);
    return null;
  }
}

export function clearGameState() {
  localStorage.removeItem(SAVE_KEY);
}

export function saveRunResult(score: number, endingId: string) {
  try {
    const historyStr = localStorage.getItem(HISTORY_KEY);
    const history = historyStr ? JSON.parse(historyStr) : [];
    history.push({ score, endingId, date: new Date().toISOString() });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.error("Failed to save run history", e);
  }
}
