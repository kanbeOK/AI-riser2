import { describe, it, expect } from 'vitest';
import { SEED_SCENARIOS } from '../src/data/scenarios';

describe('Domain Rules', () => {
  it('should have at least 6 seed scenarios', () => {
    expect(SEED_SCENARIOS.length).toBeGreaterThanOrEqual(6);
  });

  it('scenarios should have valid targetProfiles', () => {
    const allProfiles = new Set(SEED_SCENARIOS.flatMap(s => s.targetProfiles));
    expect(allProfiles.has('student') || allProfiles.has('family') || allProfiles.has('office') || allProfiles.has('shopper')).toBeTruthy();
  });

  it('scenarios should contain official sources', () => {
    SEED_SCENARIOS.forEach(s => {
      expect(s.officialSource).toBeDefined();
      expect(s.officialSource.url).toBeDefined();
      expect(s.officialSource.publisher).toBeDefined();
    });
  });

  it('scenarios should contain safety verification scripts', () => {
    SEED_SCENARIOS.forEach(s => {
      expect(s.safeResponseScript).toBeDefined();
      expect(s.safeResponseScript.length).toBeGreaterThan(5);
    });
  });
});
