import { GameState, GameAction, DecisionRecord, GameMessage } from './types';
import { CASES } from './content/cases';

export const INITIAL_STATE: GameState = {
  sessionId: "",
  seed: "",
  mode: "solo",
  difficulty: "normal",
  players: [],
  activePlayerIndex: 0,
  
  currentTime: "07:30",
  timeSlot: "morning",
  dayProgress: 0,
  
  walletShield: 100,
  identityShield: 100,
  familyTrust: 100,
  pressure: 0,
  
  currentCaseId: null,
  currentSceneId: null,
  currentChannel: "chat",
  
  discoveredClueIds: [],
  collectedEvidenceIds: [],
  completedCaseIds: [],
  
  decisions: [],
  messageHistory: [],
  unlockedCodexIds: [],
  earnedBadgeIds: [],
  
  status: "intro",
  endingId: null
};

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_RUN":
      return {
        ...INITIAL_STATE,
        sessionId: Math.random().toString(36).substring(7),
        seed: action.payload.seed || Date.now().toString(),
        mode: action.payload.mode,
        difficulty: action.payload.difficulty,
        status: "playing"
      };
    
    case "RECEIVE_EVENT":
      return {
        ...state,
        currentCaseId: action.payload.caseId,
        currentSceneId: action.payload.sceneId,
        currentChannel: action.payload.channel,
        messageHistory: [
          ...state.messageHistory,
          {
            id: Date.now().toString(),
            sender: "attacker",
            text: action.payload.message,
            timestamp: state.currentTime
          }
        ]
      };
      
    case "INSPECT_CLUE":
      if (!state.discoveredClueIds.includes(action.payload.clueId)) {
        return {
          ...state,
          discoveredClueIds: [...state.discoveredClueIds, action.payload.clueId],
          collectedEvidenceIds: [...state.collectedEvidenceIds, action.payload.clueId]
        };
      }
      return state;

    case "CHOOSE_ACTION": {
      const decision: DecisionRecord = {
        id: Date.now().toString(),
        caseId: state.currentCaseId!,
        sceneId: state.currentSceneId!,
        actionId: action.payload.actionId,
        timestamp: state.currentTime,
        safe: action.payload.safe,
        scoreDelta: action.payload.scoreDelta
      };
      
      const newWallet = Math.max(0, Math.min(100, state.walletShield + (action.payload.walletDelta || 0)));
      const newIdentity = Math.max(0, Math.min(100, state.identityShield + (action.payload.identityDelta || 0)));
      const newFamily = Math.max(0, Math.min(100, state.familyTrust + (action.payload.familyDelta || 0)));
      const newPressure = Math.max(0, Math.min(100, state.pressure + (action.payload.pressureDelta || 0)));
      
      return {
        ...state,
        decisions: [...state.decisions, decision],
        walletShield: newWallet,
        identityShield: newIdentity,
        familyTrust: newFamily,
        pressure: newPressure,
        status: action.payload.nextStatus || state.status
      };
    }
    
    case "SUBMIT_REPLY":
      return {
        ...state,
        status: "awaiting_ai",
        messageHistory: [
          ...state.messageHistory,
          {
            id: Date.now().toString(),
            sender: "player",
            text: action.payload.text,
            timestamp: state.currentTime
          }
        ]
      };
      
    case "APPLY_AI_RESPONSE":
    case "APPLY_FALLBACK_RESPONSE":
      return {
        ...state,
        status: "playing",
        pressure: Math.max(0, Math.min(100, state.pressure + (action.payload.pressureDelta || 0))),
        messageHistory: [
          ...state.messageHistory,
          {
            id: Date.now().toString(),
            sender: "attacker",
            text: action.payload.message,
            timestamp: state.currentTime,
            isFallback: action.type === "APPLY_FALLBACK_RESPONSE"
          }
        ]
      };
      
    case "ADVANCE_TIME": {
      // Very simple time advancement for now
      const [h, m] = state.currentTime.split(":").map(Number) as [number, number];
      let newM = m + action.payload.minutes;
      let newH = h + Math.floor(newM / 60);
      newM = newM % 60;
      
      let newTimeSlot = state.timeSlot;
      if (newH >= 12 && newH < 17) newTimeSlot = "noon";
      else if (newH >= 17 && newH < 20) newTimeSlot = "afternoon";
      else if (newH >= 20 && newH < 23) newTimeSlot = "evening";
      else if (newH >= 23 || newH < 6) newTimeSlot = "night";
      
      return {
        ...state,
        currentTime: `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`,
        timeSlot: newTimeSlot
      };
    }

    case "COMPLETE_CASE":
      return {
        ...state,
        completedCaseIds: [...state.completedCaseIds, state.currentCaseId!],
        currentCaseId: null,
        currentSceneId: null,
        status: "case_complete"
      };
      
    case "END_RUN":
      return {
        ...state,
        status: "debrief",
        endingId: action.payload.endingId
      };
      
    case "RESET_RUN":
      return INITIAL_STATE;
      
    default:
      return state;
  }
}
