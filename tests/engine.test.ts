import { describe, it, expect } from 'vitest';
import { gameReducer, INITIAL_STATE } from '../src/game/engine';
import { GameAction } from '../src/game/types';

describe('Game Engine', () => {
  it('START_RUN sets mode and status', () => {
    const action: GameAction = { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal', seed: 'test' } };
    const state = gameReducer(INITIAL_STATE, action);
    expect(state.mode).toBe('solo');
    expect(state.status).toBe('playing');
    expect(state.seed).toBe('test');
    expect(state.sessionId).toBeTruthy();
  });

  it('RECEIVE_EVENT sets current case and history', () => {
    const action: GameAction = { 
      type: 'RECEIVE_EVENT', 
      payload: { caseId: 'c1', sceneId: 's1', channel: 'chat', message: 'hello' } 
    };
    const state = gameReducer(INITIAL_STATE, action);
    expect(state.currentCaseId).toBe('c1');
    expect(state.messageHistory).toHaveLength(1);
    expect(state.messageHistory[0]?.text).toBe('hello');
  });

  it('CHOOSE_ACTION clamps resources between 0 and 100', () => {
    const action: GameAction = { 
      type: 'CHOOSE_ACTION', 
      payload: { actionId: 'a1', safe: false, scoreDelta: -10, walletDelta: -200, pressureDelta: 150 } 
    };
    const state = gameReducer({ ...INITIAL_STATE, currentCaseId: 'c', currentSceneId: 's' }, action);
    expect(state.walletShield).toBe(0); // Clamped from 100 - 200
    expect(state.pressure).toBe(100); // Clamped from 0 + 150
    expect(state.decisions).toHaveLength(1);
  });
  
  it('ADVANCE_TIME advances clock and timeslot correctly', () => {
    const action: GameAction = { type: 'ADVANCE_TIME', payload: { minutes: 300 } }; // 5 hours
    const state = gameReducer(INITIAL_STATE, action);
    // Initial is 07:30
    expect(state.currentTime).toBe('12:30');
    expect(state.timeSlot).toBe('noon');
  });
});
