import { describe, it, expect } from 'vitest';
import { campaignReducer, INITIAL_STATE } from '../src/game/state/reducer';

describe('Gameplay Integration', () => {

  it("demo renders two feeds immediately", () => {
    const state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'demo' } });
    expect(state.mode).toBe('demo');
    expect(Object.keys(state.feeds).length).toBe(2);
    expect(state.feeds['c1_qr_delivery']).toBeDefined();
    expect(state.feeds['c3_bank_impersonation']).toBeDefined();
  });

  it("solo starts first feed without manual fast-forward", () => {
    const state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    expect(state.scheduledEvents.some(e => e.id === 'solo_start_1' && e.minute === 7 * 60 + 1)).toBe(true);
  });

  it("sleep advances day 1 to day 2", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    state = campaignReducer(state, { type: 'SLEEP', payload: {} });
    expect(state.day).toBe(2);
    expect(state.phase).toBe('morning');
    expect(state.location).toBe('apartment');
    expect(state.scheduledEvents.some(e => e.id === 'solo_start_2')).toBe(true);
  });

  it("sleep advances day 2 to day 3", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    state = campaignReducer(state, { type: 'SLEEP', payload: {} }); // to day 2
    state.rentPaid = true; // pay rent so we don't lose
    state = campaignReducer(state, { type: 'SLEEP', payload: {} }); // to day 3
    expect(state.day).toBe(3);
    expect(state.scheduledEvents.some(e => e.id === 'solo_start_3')).toBe(true);
  });

  it("day 3 reaches debrief", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    state.rentPaid = true;
    state = campaignReducer(state, { type: 'SLEEP', payload: {} }); // to day 2
    state = campaignReducer(state, { type: 'SLEEP', payload: {} }); // to day 3
    state = campaignReducer(state, { type: 'SLEEP', payload: {} }); // to debrief
    expect(state.status).toBe('debrief');
  });

  it("demo intervention reaches debrief", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'demo' } });
    
    // Create case and add evidence
    state = campaignReducer(state, { type: 'CREATE_CASE', payload: { id: 'c1_qr_delivery', title: 'Mã QR' } });
    state = campaignReducer(state, { type: 'EXTRACT_EVIDENCE', payload: { token: { id: 'ev1', caseId: null, feedId: 'c1_qr_delivery', eventId: '1', entityType: 'domain', label: 'L1', value: 'V1', observedAt: 0, confidence: 100, sourceRef: '' } } });
    state = campaignReducer(state, { type: 'ASSIGN_EVIDENCE', payload: { evidenceId: 'ev1', caseId: 'c1_qr_delivery' } });
    
    state = campaignReducer(state, { type: 'OPERATIONAL_ACTION', payload: { caseId: 'c1_qr_delivery', action: 'warned' } });
    
    expect(state.status).toBe('debrief');
    expect(state.speed).toBe(0);
  });

  it("empty case cannot earn credits", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    state = campaignReducer(state, { type: 'CREATE_CASE', payload: { id: 'c1_qr_delivery', title: 'Mã QR' } });
    
    const creditsBefore = state.credits;
    state = campaignReducer(state, { type: 'OPERATIONAL_ACTION', payload: { caseId: 'c1_qr_delivery', action: 'warned' } });
    
    expect(state.credits).toBe(creditsBefore);
  });

  it("resolved case cannot earn twice", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    state = campaignReducer(state, { type: 'CREATE_CASE', payload: { id: 'c1_qr_delivery', title: 'Mã QR' } });
    state = campaignReducer(state, { type: 'EXTRACT_EVIDENCE', payload: { token: { id: 'ev1', caseId: null, feedId: 'c1_qr_delivery', eventId: '1', entityType: 'domain', label: 'L1', value: 'V1', observedAt: 0, confidence: 100, sourceRef: '' } } });
    state = campaignReducer(state, { type: 'ASSIGN_EVIDENCE', payload: { evidenceId: 'ev1', caseId: 'c1_qr_delivery' } });
    
    state = campaignReducer(state, { type: 'OPERATIONAL_ACTION', payload: { caseId: 'c1_qr_delivery', action: 'warned' } });
    const creditsAfterFirst = state.credits;
    
    state = campaignReducer(state, { type: 'OPERATIONAL_ACTION', payload: { caseId: 'c1_qr_delivery', action: 'warned' } });
    expect(state.credits).toBe(creditsAfterFirst);
  });

  it("freeze requires evidence and graph link", () => {
    let state = campaignReducer(INITIAL_STATE, { type: 'START_CAMPAIGN', payload: { mode: 'solo' } });
    state = campaignReducer(state, { type: 'CREATE_CASE', payload: { id: 'c1_qr_delivery', title: 'Mã QR' } });
    state = campaignReducer(state, { type: 'EXTRACT_EVIDENCE', payload: { token: { id: 'ev1', caseId: null, feedId: 'c1_qr_delivery', eventId: '1', entityType: 'domain', label: 'L1', value: 'V1', observedAt: 0, confidence: 100, sourceRef: '' } } });
    state = campaignReducer(state, { type: 'EXTRACT_EVIDENCE', payload: { token: { id: 'ev2', caseId: null, feedId: 'c1_qr_delivery', eventId: '1', entityType: 'domain', label: 'L2', value: 'V2', observedAt: 0, confidence: 100, sourceRef: '' } } });
    state = campaignReducer(state, { type: 'ASSIGN_EVIDENCE', payload: { evidenceId: 'ev1', caseId: 'c1_qr_delivery' } });
    state = campaignReducer(state, { type: 'ASSIGN_EVIDENCE', payload: { evidenceId: 'ev2', caseId: 'c1_qr_delivery' } });
    
    const creditsBefore = state.credits;
    // Missing link
    state = campaignReducer(state, { type: 'OPERATIONAL_ACTION', payload: { caseId: 'c1_qr_delivery', action: 'frozen' } });
    expect(state.credits).toBe(creditsBefore);
    
    // Add link
    state = campaignReducer(state, { type: 'LINK_EVIDENCE', payload: { sourceId: 'ev1', targetId: 'ev2', label: 'link' } });
    state = campaignReducer(state, { type: 'OPERATIONAL_ACTION', payload: { caseId: 'c1_qr_delivery', action: 'frozen' } });
    expect(state.credits).toBeGreaterThan(creditsBefore);
  });
});
