export type OfficialSource = {
  publisher: string;
  title: string;
  url: string;
  publicationDate: string;
  accessDate: string;
};

export type SceneContent = {
  text?: string;
  senderName?: string;
  senderAvatar?: string;
  timestamp?: string;
  attachment?: {
    type: "qr" | "document" | "link";
    url: string;
    previewUrl?: string;
  };
  html?: string;
};

export type ScheduledConsequence = {
  triggerAfterMinutes: number;
  caseId: string;
  sceneId: string;
};

export type SceneAction = {
  id: string;
  label: string;
  interaction:
    | "inspect"
    | "open_app"
    | "call"
    | "reply"
    | "hold_preview"
    | "save_evidence"
    | "block"
    | "report"
    | "continue"
    | "recover";
  nextSceneId: string | null;
  effects: {
    wallet?: number;
    identity?: number;
    family?: number;
    pressure?: number;
    timeMinutes?: number;
  };
  revealsClueIds?: string[];
  schedulesConsequences?: ScheduledConsequence[];
  riskTag: "safe" | "caution" | "unsafe" | "recovery";
};

export type GameScene = {
  id: string;
  channel:
    | "lockscreen"
    | "notification"
    | "chat"
    | "call"
    | "browser"
    | "bank"
    | "official_app"
    | "task_app"
    | "system";
  title: string;
  content: SceneContent;
  clueIds: string[];
  actions: SceneAction[];
};

export type GameCase = {
  id: string;
  title: string;
  startTime: string;
  difficulty: "easy" | "medium" | "hard";
  initialSceneId: string;
  tactics: string[];
  source: OfficialSource;
  scenes: Record<string, GameScene>;
};
