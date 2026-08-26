export type EntityType = "domain" | "account" | "phone" | "device" | "message" | "transaction" | "person" | "organization";

export type EvidenceToken = {
  id: string;
  caseId: string | null;
  feedId: string;
  eventId: string;
  entityType: EntityType;
  label: string;
  value: string;
  observedAt: number;
  confidence: number;
  sourceRef: string;
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
export type EndingId = "e_luoi_khep_kin" | "e_nguoi_tot_khong_nha" | "e_ban_tay_qua_nhanh" | "e_bong_ma_rut_lui" | "e_kiet_suc";

export type SideJobState = {
  id: string;
  name: string;
  progress: number;
  maxProgress: number;
  reward: number;
};

export type FeedState = {
  id: string;
  title: string;
  type: "chat" | "call" | "transaction" | "social";
  status: "active" | "frozen" | "closed";
  messages: FeedMessage[];
};

export type FeedMessage = {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  clues: string[]; // references to event details that can be extracted
};

export type CaseFileState = {
  id: string;
  title: string;
  status: "open" | "resolved" | "failed";
  evidenceIds: string[];
  verdict: "warned" | "frozen" | "banned" | "escalated" | "ignored" | null;
};

export type VictimState = {
  id: string;
  name: string;
  moneyLost: number;
  status: "safe" | "at_risk" | "scammed";
};

export type ScheduledEvent = 
  | { id: string; day: number; minute: number; type: "feed_start"; payload: { feedId: string; title: string; type: "chat" | "call" | "transaction" | "social" } }
  | { id: string; day: number; minute: number; type: "feed_message"; payload: { feedId: string; message: FeedMessage } }
  | { id: string; day: number; minute: number; type: "feed_close"; payload: { feedId: string } }
  | { id: string; day: number; minute: number; type: "bill_due"; payload: { type: "rent" | "internet"; amount: number } }
  | { id: string; day: number; minute: number; type: "job_offer"; payload: { job: SideJobState } }
  | { id: string; day: number; minute: number; type: "network_activity"; payload: { heatDelta: number } };

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

export type CampaignState = {
  schemaVersion: number;
  seed: string;
  mode: "solo" | "team" | "demo";

  day: number;
  minuteOfDay: number;
  speed: 0 | 1 | 2 | 4;
  location: "apartment" | "workstation";
  phase: "morning" | "shift" | "evening" | "sleep" | "ending";

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
  upgrades: UpgradeId[];
  activeSideJob: SideJobState | null;

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
  | { type: "CREATE_CASE"; payload: { id: string; title: string } }
  | { type: "START_CAMPAIGN"; payload: { mode: "solo"|"team"|"demo", seed?: string } }
  | { type: "SET_SPEED"; payload: { speed: 0|1|2|4 } }
  | { type: "TICK"; payload: { minutes: number } }
  | { type: "PROCESS_EVENT"; payload: { event: ScheduledEvent } }
  | { type: "CHANGE_LOCATION"; payload: { location: "apartment" | "workstation" } }
  | { type: "CHANGE_PHASE"; payload: { phase: CampaignState["phase"] } }
  | { type: "EXTRACT_EVIDENCE"; payload: { token: EvidenceToken } }
  | { type: "ASSIGN_EVIDENCE"; payload: { evidenceId: string; caseId: string } }
  | { type: "LINK_EVIDENCE"; payload: { sourceId: string; targetId: string; label: string } }
  | { type: "EAT"; payload: { itemId: string } }
  | { type: "SLEEP"; payload: {} }
  | { type: "PAY_RENT"; payload: {} }
  | { type: "PAY_INTERNET"; payload: {} }
  | { type: "BUY_ITEM"; payload: { item: InventoryItem; cost: number } }
  | { type: "START_JOB"; payload: { job: SideJobState } }
  | { type: "WORK_JOB"; payload: { progress: number } }
  | { type: "OPERATIONAL_ACTION"; payload: { caseId: string; action: CaseFileState["verdict"] } }
  | { type: "END_DAY"; payload: {} };
