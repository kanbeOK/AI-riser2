export type EntityType = "domain" | "account" | "bankAccount" | "phone" | "device" | "message" | "transaction" | "person" | "organization" | "ip" | "qrPayload" | "callerMetadata" | "deviceFingerprint" | "transcript" | "identityClaim";

export type EvidenceToken = {
  id: string;
  caseId: string | null;
  feedId: string;
  eventId: string;
  entityType: EntityType;
  label: string;
  value: string;
  displayValue?: string;
  observedAt: number;
  confidence: number;
  sourceRef: string;
  lookupResult?: string | null;
  relatedEntityIds?: string[];
  educationalNote?: string;
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

export type UpgradeId = string;
export type UpgradesState = Record<UpgradeId, boolean>;

export type SideJobState = {
  id: string;
  name: string;
  progress: number;
  maxProgress: number;
  reward: number;
};

export type EvidenceLog = {
  id: string;
  timestamp: number;
  message: string;
};

export type FeedMessage = {
  id: string;
  senderId: "user" | "player" | "scammer" | "system";
  senderName: string;
  text: string;
  timestamp: number;
  clues: string[];
};

export type FeedState = {
  id: string;
  title: string;
  type?: string;
  status: "idle" | "active" | "resolved" | "failed" | "closed";
  messages: FeedMessage[];
};

export type CaseFileState = {
  id: string;
  title: string;
  status: "open" | "closed" | "resolved";
  evidenceIds: string[];
  verdict: "warned" | "frozen" | "banned" | "escalated" | "ignored" | null;
};

export type GameEventPayload = any;

export type GameEvent = {
  id: string;
  day: number;
  minute: number;
  type: string;
  payload: GameEventPayload;
};

export type VictimState = {
  id: string;
  name: string;
  trustScore: number;
  walletBalance: number;
};

export type ScheduledEvent = {
  id: string;
  day: number;
  minute: number;
  type: string;
  payload: any;
};

export type GameNotification = {
  id: string;
  time: number;
  message: string;
  type: "info" | "warning" | "error" | "success";
};

export type DailyReport = {
  day: number;
  salaryEarned: number;
  expenses: number;
  casesResolved: number;
  falsePositives: number;
  victimsProtected: number;
  summary: string;
};

export type EndingId = "homeless" | "fired" | "promoted" | "syndicate_bust" | "e_nguoi_tot_khong_nha" | "e_kiet_suc" | "e_luoi_khep_kin";

export type CampaignState = {
  day: number;
  minuteOfDay: number;
  credits: number;
  energy: number;
  hunger: number;
  location: "apartment" | "workstation" | "city";
  inventory: InventoryItem[];
  rentDueDay: number;
  rentAmount: number;
  rentPaid: boolean;
  internetPaidThroughDay: number;
  upgrades: UpgradesState;
  activeSideJob: SideJobState | null;

  mode?: "demo" | "full" | "solo";
  seed?: string;
  speed?: 0 | 1 | 2 | 4;
  phase?: "morning" | "work" | "evening" | "night" | "sleep";
  agencyTrust?: number;
  networkHeat?: number;

  feeds: Record<string, FeedState>;
  cases: Record<string, CaseFileState>;
  evidence: EvidenceToken[];
  graphEdges: EvidenceEdge[];
  victims: Record<string, VictimState>;

  scheduledEvents: ScheduledEvent[];
  processedEventIds: string[];
  notifications: GameNotification[];
  dailyReports: DailyReport[];
  endingsUnlocked: EndingId[];

  status: "playing" | "paused" | "debrief" | "finished";
};

export type GameAction =
  | { type: "START_CAMPAIGN"; payload: { mode: "demo" | "full" | "solo"; seed?: string } }
  | { type: "SET_SPEED"; payload: { speed: 0 | 1 | 2 | 4 } }
  | { type: "TICK"; payload: { minutes: number } }
  | { type: "PROCESS_EVENT"; payload: { event: GameEvent } }
  | { type: "CHANGE_LOCATION"; payload: { location: "apartment" | "workstation" | "city" } }
  | { type: "CHANGE_PHASE"; payload: { phase: "morning" | "work" | "evening" | "night" | "sleep" } }
  | { type: "EXTRACT_EVIDENCE"; payload: { token: EvidenceToken } }
  | { type: "CREATE_CASE"; payload: { id: string; title: string } }
  | { type: "ASSIGN_EVIDENCE"; payload: { evidenceId: string; caseId: string } }
  | { type: "LINK_EVIDENCE"; payload: { sourceId: string; targetId: string; label: string } }
  | { type: "EAT"; payload: { itemId: string } }
  | { type: "SLEEP"; payload: {} }
  | { type: "END_DAY"; payload: {} }
  | { type: "PAY_RENT"; payload: {} }
  | { type: "PAY_INTERNET"; payload: {} }
  | { type: "BUY_ITEM"; payload: { item: InventoryItem; cost: number } }
  | { type: "START_JOB"; payload: { job: SideJobState } }
  | { type: "WORK_JOB"; payload: { progress: number } }
  | { type: "OPERATIONAL_ACTION"; payload: { caseId: string; action: CaseFileState["verdict"] } };
