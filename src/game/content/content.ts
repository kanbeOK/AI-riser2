import type { EntityType, FeedState } from "../state/types";

export type EvidenceTemplate = {
  id: string;
  label: string;
  entityType: EntityType;
  displayValue: string;
  lookupResult: string | null;
  relatedEntityIds: string[];
  educationalNote: string;
};

export type StoryBeat = {
  id: string;
  sender: "scammer" | "system" | "operator";
  senderName: string;
  text: string;
  clues: string[];
  waitBefore: number;
};

export type ScenarioDefinition = {
  id: string;
  day: 1 | 2 | 3;
  title: string;
  brief: string;
  type: FeedState["type"];
  isScam: boolean;
  victim: {
    id: string;
    name: string;
    moneyAtRisk: number;
  };
  tactics: string[];
  learningObjective: string;
  evidenceBase: Record<string, EvidenceTemplate>;
  beats: StoryBeat[];
  redHerringClues: string[];
  deadlineMinutes: number;
};
