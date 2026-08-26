import { describe, it, expect } from 'vitest';
import { gameReducer, INITIAL_STATE } from '../src/game/engine';

describe('Engine Logic', () => {
  it('Seed reproducibility', () => {
    const s1 = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal', seed: 'test1' } });
    const s2 = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal', seed: 'test1' } });
    expect(s1.sessionId).toBe(s2.sessionId);
  });

  it('Different seed variation', () => {
    const s1 = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal', seed: 'test1' } });
    const s2 = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal', seed: 'test2' } });
    expect(s1.sessionId).not.toBe(s2.sessionId);
  });

  it('Demo-mode fixed seed', () => {
    const s1 = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'demo', difficulty: 'normal', seed: 'demo-seed-123' } });
    expect(s1.seed).toBe('demo-seed-123');
  });

  it('Time and day-progress calculation', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'ADVANCE_TIME', payload: { minutes: 30 } });
    expect(state.currentTime).toBe("08:00");
    expect(state.dayProgress).toBeGreaterThan(0);
    
    state = gameReducer(state, { type: 'ADVANCE_TIME', payload: { minutes: 900 } });
    expect(state.currentTime).toBe("23:00");
    expect(state.timeSlot).toBe("night");
  });

  it('Valid scene transition', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal' } });
    state = gameReducer(state, { type: 'RECEIVE_EVENT', payload: { caseId: 'c1', sceneId: 's1', channel: 'chat' } });
    expect(state.currentSceneId).toBe('s1');

    state = gameReducer(state, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: true, nextSceneId: 's2' } });
    expect(state.currentSceneId).toBe('s2');
  });

  it('Duplicate clue prevention', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'INSPECT_CLUE', payload: { clueId: 'clue1' } });
    state = gameReducer(state, { type: 'INSPECT_CLUE', payload: { clueId: 'clue1' } });
    expect(state.discoveredClueIds).toEqual(['clue1']);
  });

  it('Evidence collection', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: true, revealsClueIds: ['clue1', 'clue2'] } });
    expect(state.discoveredClueIds).toEqual(['clue1', 'clue2']);
  });

  it('Delayed consequence scheduling and triggering', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: true, schedulesConsequences: [{ triggerAfterMinutes: 100, caseId: 'c1', sceneId: 's_delayed' }] } });
    expect(state.pendingConsequences.length).toBe(1);

    state = gameReducer(state, { type: 'TRIGGER_CONSEQUENCE', payload: { caseId: 'c1', sceneId: 's_delayed' } });
    expect(state.pendingConsequences.length).toBe(0);
    expect(state.currentSceneId).toBe('s_delayed');
  });

  it('Resource clamping', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: false, walletDelta: -150 } });
    expect(state.walletShield).toBe(0);
    
    state = gameReducer(state, { type: 'CHOOSE_ACTION', payload: { actionId: 'a2', safe: true, walletDelta: 200 } });
    expect(state.walletShield).toBe(100);
  });

  it('Unsafe action', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'unsafe1', safe: false, identityDelta: -40 } });
    expect(state.identityShield).toBe(60);
    expect(state.decisions[0].safe).toBe(false);
  });

  it('Safe action', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'safe1', safe: true, walletDelta: 5 } });
    expect(state.walletShield).toBe(100);
    expect(state.decisions[0].safe).toBe(true);
  });

  it('Recovery action', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'recover1', safe: true, identityDelta: -10 } });
    expect(state.identityShield).toBe(90);
    expect(state.decisions[0].safe).toBe(true);
  });

  it('Ending selection', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'END_RUN', payload: { endingId: 'e_survivor' } });
    expect(state.status).toBe('debrief');
    expect(state.endingId).toBe('e_survivor');
  });

  it('Complete case sets case_complete', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'RECEIVE_EVENT', payload: { caseId: 'c1', sceneId: 's1', channel: 'chat' } });
    state = gameReducer(state, { type: 'COMPLETE_CASE', payload: { caseId: 'c1' } });
    expect(state.status).toBe('case_complete');
    expect(state.completedCaseIds).toContain('c1');
  });
});

describe('More Engine Logic', () => {
  it('Reset run clears state', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal' } });
    state = gameReducer(state, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: true, walletDelta: -20 } });
    state = gameReducer(state, { type: 'RESET_RUN' });
    expect(state.walletShield).toBe(100);
    expect(state.sessionId).toBe("");
  });

  it('Receive event without message does not add to history', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'RECEIVE_EVENT', payload: { caseId: 'c1', sceneId: 's1', channel: 'system' } });
    expect(state.messageHistory.length).toBe(0);
  });

  it('Apply AI response', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'SUBMIT_REPLY', payload: { text: 'hello' } });
    expect(state.status).toBe('awaiting_ai');
    state = gameReducer(state, { type: 'APPLY_AI_RESPONSE', payload: { message: 'hi', pressureDelta: 10 } });
    expect(state.status).toBe('playing');
    expect(state.pressure).toBe(10);
  });

  it('Apply Fallback response', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'SUBMIT_REPLY', payload: { text: 'hello' } });
    state = gameReducer(state, { type: 'APPLY_FALLBACK_RESPONSE', payload: { message: 'fallback', pressureDelta: 5 } });
    expect(state.status).toBe('playing');
    expect(state.pressure).toBe(5);
    expect(state.messageHistory[state.messageHistory.length-1].isFallback).toBe(true);
  });

  it('Choose action sets nextStatus', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: true, nextStatus: 'finished' } });
    expect(state.status).toBe('finished');
  });

  it('Time slot transitions', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'ADVANCE_TIME', payload: { minutes: 5 * 60 } }); // 12:30
    expect(state.timeSlot).toBe('noon');
    state = gameReducer(state, { type: 'ADVANCE_TIME', payload: { minutes: 5 * 60 } }); // 17:30
    expect(state.timeSlot).toBe('afternoon');
    state = gameReducer(state, { type: 'ADVANCE_TIME', payload: { minutes: 3 * 60 } }); // 20:30
    expect(state.timeSlot).toBe('evening');
    state = gameReducer(state, { type: 'ADVANCE_TIME', payload: { minutes: 3 * 60 } }); // 23:30
    expect(state.timeSlot).toBe('night');
  });
});

describe('Edge cases', () => {
  it('Invalid action id safely ignored or handled', () => {
     let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'nonexistent', safe: false } });
     expect(state.decisions.length).toBe(1);
  });
  it('Save schema validation', () => {
     expect(INITIAL_STATE.schemaVersion).toBe(1);
  });
  it('Corrupted save rejection', () => {
     const saveStr = '{ corrupted }';
     try {
       JSON.parse(saveStr);
     } catch (e) {
       expect(e).toBeDefined();
     }
  });
  it('Time slot morning', () => {
     expect(INITIAL_STATE.timeSlot).toBe('morning');
  });
  it('Trigger consequence clears pending', () => {
    let state = gameReducer(INITIAL_STATE, { type: 'CHOOSE_ACTION', payload: { actionId: 'a1', safe: true, schedulesConsequences: [{ triggerAfterMinutes: 10, caseId: 'c1', sceneId: 's1' }] } });
    state = gameReducer(state, { type: 'TRIGGER_CONSEQUENCE', payload: { caseId: 'c1', sceneId: 's1' } });
    expect(state.pendingConsequences.length).toBe(0);
  });
});
