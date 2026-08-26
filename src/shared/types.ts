export type ProfileId = 'student' | 'shopper' | 'office' | 'family';
export type ActionKind = 'reply' | 'verify' | 'consult' | 'block_report';
export type ScamTactic = 'authority' | 'fear' | 'urgency' | 'isolation' | 'greed' | 'sympathy';
export type ConfidenceBand = 'low' | 'medium' | 'high';
export type RiskLevel = 'high' | 'suspicious' | 'insufficient' | 'few_clear_signs';

export interface Scenario {
  id: string;
  title: string;
  targetProfiles: ProfileId[];
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedDuration: string;
  learningObjective: string;
  initialMessage: string;
  groundTruthTactics: ScamTactic[];
  observableCues: string[];
  safeVerificationInstructions: string;
  safeResponseScript: string;
  officialSource: {
    publisher: string;
    title: string;
    url: string;
    publicationDate: string;
    accessDate: string;
  };
}

export interface MissionTurn {
  id: string;
  type: 'scenario' | 'user';
  message: string;
  actionKind?: ActionKind;
  isGeminiAdapted?: boolean;
}

export interface MissionResult {
  completed: boolean;
  score: number;
  reflexScoreBreakdown: ReflexScoreBreakdown;
}

export interface ReflexScoreBreakdown {
  safeActionQuality: number;
  cueRecognition: number;
  responseSequence: number;
  total: number;
}
