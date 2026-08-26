export type GameMode = "solo" | "demo";

export type GamePhase = "morning" | "shift" | "evening" | "sleep" | "ending";

export type GameSpeed = 0 | 1 | 2 | 4;

export type EntityType =
  | "domain"
  | "bankAccount"
  | "phone"
  | "transaction"
  | "qrPayload"
  | "callerMetadata"
  | "deviceFingerprint"
  | "transcript"
  | "identityClaim";

export type EvidenceToken = {
  id: string;
  caseId: string;
  feedId: string;
  eventId: string;
  entityType: EntityType;
  label: string;
  value: string;
  observedAt: number;
  confidence: number;
  sourceRef: string;
  lookupResult: string | null;
  relatedEntityIds: string[];
  educationalNote: string;
  lookedUp: boolean;
};

export type EvidenceEdge = {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  type: "food" | "tool";
  effectValue: number;
};

export type SideJobState = {
  id: string;
  name: string;
  progress: number;
  maxProgress: number;
  reward: number;
  energyCost: number;
  timeCost: number;
};

export type FeedMessage = {
  id: string;
  senderId: "player" | "scammer" | "system" | "operator";
  senderName: string;
  text: string;
  timestamp: number;
  clues: string[];
};

export type FeedState = {
  id: string;
  day: number;
  title: string;
  type: "chat" | "call" | "transaction" | "social";
  status: "active" | "resolved" | "failed" | "closed";
  messages: FeedMessage[];
  startedAt: number;
  deadlineMinute: number;
  risk: number;
};

export type Verdict = "warned" | "frozen" | "escalated" | "ignored";

export type CaseFileState = {
  id: string;
  day: number;
  title: string;
  status: "open" | "resolved" | "failed";
  evidenceIds: string[];
  verdict: Verdict | null;
  resolvedAt: number | null;
};

export type VictimState = {
  id: string;
  scenarioId: string;
  name: string;
  status: "safe" | "at_risk" | "scammed";
  moneyAtRisk: number;
};

type EventBase = {
  id: string;
  day: number;
  minute: number;
};

export type FeedStartEvent = EventBase & {
  type: "feed_start";
  payload: {
    feedId: string;
    title: string;
    feedType: FeedState["type"];
    deadlineMinute: number;
    victimId: string;
    victimName: string;
    moneyAtRisk: number;
  };
};

export type FeedMessageEvent = EventBase & {
  type: "feed_message";
  payload: {
    feedId: string;
    message: FeedMessage;
  };
};

export type FeedDeadlineEvent = EventBase & {
  type: "feed_deadline";
  payload: {
    feedId: string;
  };
};

export type NetworkActivityEvent = EventBase & {
  type: "network_activity";
  payload: {
    heatDelta: number;
    message: string;
  };
};

export type ScheduledEvent =
  | FeedStartEvent
  | FeedMessageEvent
  | FeedDeadlineEvent
  | NetworkActivityEvent;

export type GameNotification = {
  id: string;
  time: number;
  message: string;
  type: "info" | "warning" | "error" | "success";
};

export type DayStats = {
  salaryEarned: number;
  expenses: number;
  casesResolved: number;
  falsePositives: number;
  victimsProtected: number;
};

export type DailyReport = DayStats & {
  day: number;
  summary: string;
};

export type EndingId = "syndicate_bust" | "signal_lost" | "homeless" | "burnout";

export type CampaignState = {
  seed: string;
  mode: GameMode;
  status: "playing" | "paused" | "debrief" | "finished";
  phase: GamePhase;
  location: "apartment" | "workstation";
  day: number;
  minuteOfDay: number;
  speed: GameSpeed;
  shiftStartedDays: number[];

  credits: number;
  hunger: number;
  energy: number;
  agencyTrust: number;
  networkHeat: number;

  rentAmount: number;
  rentDueDay: number;
  rentPaid: boolean;
  internetPaidThroughDay: number;
  inventory: InventoryItem[];
  activeSideJob: SideJobState | null;
  completedSideJobDays: number[];

  feeds: Record<string, FeedState>;
  cases: Record<string, CaseFileState>;
  evidence: EvidenceToken[];
  graphEdges: EvidenceEdge[];
  victims: Record<string, VictimState>;
  scheduledEvents: ScheduledEvent[];
  processedEventIds: string[];
  notifications: GameNotification[];

  dayStats: DayStats;
  dailyReports: DailyReport[];
  endingsUnlocked: EndingId[];
};

export type GameAction =
  | { type: "START_CAMPAIGN"; payload: { mode: GameMode; seed?: string } }
  | { type: "ENTER_WORKSTATION" }
  | { type: "START_SHIFT" }
  | { type: "END_SHIFT" }
  | { type: "SET_SPEED"; payload: { speed: GameSpeed } }
  | { type: "TICK"; payload: { minutes: number } }
  | { type: "PROCESS_EVENT"; payload: { event: ScheduledEvent } }
  | { type: "EXTRACT_EVIDENCE"; payload: { token: EvidenceToken } }
  | { type: "RUN_OSINT"; payload: { evidenceId: string } }
  | { type: "LINK_EVIDENCE"; payload: { sourceId: string; targetId: string } }
  | { type: "OPERATIONAL_ACTION"; payload: { caseId: string; action: Verdict } }
  | { type: "RETURN_TO_APARTMENT" }
  | { type: "EAT"; payload: { itemId: string } }
  | { type: "BUY_ITEM"; payload: { item: InventoryItem; cost: number } }
  | { type: "PAY_RENT" }
  | { type: "PAY_INTERNET" }
  | { type: "START_JOB"; payload: { job: SideJobState } }
  | { type: "WORK_JOB"; payload: { progress: number } }
  | { type: "SLEEP" };
