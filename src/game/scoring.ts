import { GameState } from './types';

export function calculateRunScore(state: GameState): number {
  let score = 50; // base score
  
  // resource points
  score += (state.walletShield - 100) * 0.2;
  score += (state.identityShield - 100) * 0.2;
  score += (state.familyTrust - 100) * 0.2;
  
  // evidence points
  score += state.collectedEvidenceIds.length * 5;
  
  // decision impacts
  for (const dec of state.decisions) {
    score += dec.scoreDelta || 0;
  }
  
  // pressure penalty
  score -= state.pressure * 0.1;
  
  return Math.max(0, Math.min(100, Math.round(score)));
}
