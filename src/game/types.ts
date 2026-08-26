import { ScheduledConsequence, SceneAction } from "./schema";

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
  currentChannel: "lockscreen" | "notification" | "chat" | "call" | "browser" | "bank" | "official_app" | "task_app" | "system";

  discoveredClueIds: string[];
  collectedEvidenceIds: string[];
  completedCaseIds: string[];
  
  pendingConsequences: ScheduledConsequence[];

  decisions: DecisionRecord[];
  messageHistory: GameMessage[];
  unlockedCodexIds: string[];
  earnedBadgeIds: string[];

  status: "intro" | "playing" | "awaiting_ai" | "case_complete" | "debrief" | "finished";
  endingId: string | null;
  schemaVersion: number;
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

export type ReceiveEventPayload = {
  caseId: string;
  sceneId: string;
  channel: "lockscreen" | "notification" | "chat" | "call" | "browser" | "bank" | "official_app" | "task_app" | "system";
  message?: string;
};

export type ChooseActionPayload = {
  actionId: string;
  safe: boolean;
  scoreDelta?: number;
  walletDelta?: number;
  identityDelta?: number;
  familyDelta?: number;
  pressureDelta?: number;
  timeMinutes?: number;
  nextSceneId?: string | null;
  nextStatus?: GameState["status"];
  revealsClueIds?: string[];
  schedulesConsequences?: ScheduledConsequence[];
};

export type ApplyResponsePayload = {
  message: string;
  pressureDelta?: number;
};

export type CompleteCasePayload = {
  caseId: string;
};

export type GameAction =
  | { type: "START_RUN"; payload: StartRunPayload }
  | { type: "RECEIVE_EVENT"; payload: ReceiveEventPayload }
  | { type: "INSPECT_CLUE"; payload: { clueId: string } }
  | { type: "CHOOSE_ACTION"; payload: ChooseActionPayload }
  | { type: "SUBMIT_REPLY"; payload: { text: string; actionId?: string } }
  | { type: "APPLY_AI_RESPONSE"; payload: ApplyResponsePayload }
  | { type: "APPLY_FALLBACK_RESPONSE"; payload: ApplyResponsePayload }
  | { type: "ADVANCE_TIME"; payload: { minutes: number } }
  | { type: "TRIGGER_CONSEQUENCE"; payload: { caseId: string, sceneId: string } }
  | { type: "COMPLETE_CASE"; payload: CompleteCasePayload }
  | { type: "END_RUN"; payload: { endingId: string } }
  | { type: "RESET_RUN" };
