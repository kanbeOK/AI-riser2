import { describe, it, expect } from 'vitest';
import { CASES, CASE_ORDER } from '../src/game/content/cases';

describe('Scenarios Domain Logic', () => {
  it('should have multiple scenarios loaded', () => {
    expect(Object.keys(CASES).length).toBeGreaterThan(0);
    expect(CASE_ORDER.length).toBeGreaterThan(0);
  });

  it('each scenario should have required fields', () => {
    Object.values(CASES).forEach((s) => {
      expect(s.id).toBeDefined();
      expect(s.title).toBeDefined();
      expect(s.initialSceneId).toBeDefined();
      expect(s.scenes).toBeDefined();
    });
  });

  it('scenarios should contain observable cues in scenes', () => {
    Object.values(CASES).forEach((s) => {
      const hasClues = Object.values(s.scenes).some(scene => scene.clueIds && scene.clueIds.length > 0);
      expect(hasClues).toBeDefined();
    });
  });

  it('scenarios should contain ground truth tactics', () => {
    Object.values(CASES).forEach((s) => {
      expect(Array.isArray(s.tactics)).toBe(true);
      expect(s.tactics.length).toBeGreaterThan(0);
    });
  });
});
