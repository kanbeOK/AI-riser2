import { describe, it, expect } from 'vitest';
import { CASES } from '../src/game/content/cases';

describe('Scenarios Domain Logic', () => {
  it('should have multiple scenarios loaded', () => {
    expect(CASES.length).toBeGreaterThan(0);
  });
  
  it('each scenario should have required fields', () => {
    CASES.forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.title).toBeDefined();
      expect(s.learningObjective).toBeDefined();
      expect(s.initialMessage).toBeDefined();
    });
  });

  it('scenarios should contain observable cues', () => {
    CASES.forEach((s) => {
      expect(Array.isArray(s.observableCues)).toBe(true);
      expect(s.observableCues.length).toBeGreaterThan(0);
    });
  });
  
  it('scenarios should contain ground truth tactics', () => {
    CASES.forEach((s) => {
      expect(Array.isArray(s.groundTruthTactics)).toBe(true);
      expect(s.groundTruthTactics.length).toBeGreaterThan(0);
    });
  });
});
