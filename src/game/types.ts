export type OfficialSource = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  scenarioIds: string[];
  lastVerifiedAt: string;
};

export type PlayerProfile = {
  id: string;
  name: string;
};

export type GameState = {
  sessionId: string;
  seed: string;
  mode: "solo" | "squad" | "demo";
  difficulty: "normal" | "hard";
  players: PlayerProfile[];
  activePlayerIndex: number;

  currentTime: string;
  timeSlot: "morning" | "noon" | "afternoon" | "evening" | "night";
  dayProgress: number;

  walletShield: number;
  identityShield: number;
  familyTrust: number;
  pressure: number;

  currentCaseId: string | null;
  currentSceneId: string | null;
  currentChannel: "chat" | "call" | "notification" | "browser" | "bank" | "system";

  discoveredClueIds: string[];
  collectedEvidenceIds: string[];
  completedCaseIds: string[];

  decisions: DecisionRecord[];
  messageHistory: GameMessage[];
  unlockedCodexIds: string[];
  earnedBadgeIds: string[];

  status: "intro" | "playing" | "awaiting_ai" | "case_complete" | "debrief" | "finished";
  endingId: string | null;
};

export type DecisionRecord = {
  id: string;
  caseId: string;
  sceneId: string;
  actionId: string;
  timestamp: string;
  safe: boolean;
  scoreDelta: number;
};

export type GameMessage = {
  id: string;
  sender: 'system' | 'attacker' | 'player';
  text: string;
  timestamp: string;
  isFallback?: boolean;
};

export type StartRunPayload = {
  mode: "solo" | "squad" | "demo";
  difficulty: "normal" | "hard";
  seed?: string;
};

export type GameAction =
  | { type: "START_RUN"; payload: StartRunPayload }
  | { type: "RECEIVE_EVENT"; payload: any }
  | { type: "INSPECT_CLUE"; payload: { clueId: string } }
  | { type: "CHOOSE_ACTION"; payload: any }
  | { type: "SUBMIT_REPLY"; payload: { text: string } }
  | { type: "APPLY_AI_RESPONSE"; payload: any }
  | { type: "APPLY_FALLBACK_RESPONSE"; payload: any }
  | { type: "ADVANCE_TIME"; payload: { minutes: number } }
  | { type: "COMPLETE_CASE"; payload: any }
  | { type: "END_RUN"; payload: any }
  | { type: "RESET_RUN" };
