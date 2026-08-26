export type EntityType = "domain" | "phone" | "bankAccount" | "qrPayload" | "transaction" | "callerMetadata" | "deviceFingerprint" | "transcript" | "identityClaim";

export type EvidenceTemplate = {
  id: string; // The static ID of the evidence (e.g. 'c1_domain')
  label: string; // Short label
  entityType: EntityType;
  displayValue: string; // The full value seen
  lookupResult: string | null; // Result when OSINT tool used
  relatedEntityIds: string[]; // For drawing graph links
  educationalNote: string;
};

export type StoryBeat = {
  id: string;
  sender: 'scammer' | 'system';
  senderName: string;
  text: string;
  clues: string[]; // List of EvidenceTemplate IDs that are attached to this message
  waitBefore: number; // In-game minutes to wait before this beat appears
};

export type ScenarioDefinition = {
  id: string;
  title: string;
  type: "chat" | "call" | "transaction" | "social";
  tactics: string[];
  learningObjective: string;
  evidenceBase: Record<string, EvidenceTemplate>;
  beats: StoryBeat[];
  redHerringClues: string[];
  deadlineMinutes: number; // How many minutes until failure if no intervention
};

export const SCENARIOS: Record<string, ScenarioDefinition> = {
};
