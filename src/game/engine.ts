import { GameState, GameAction, DecisionRecord, GameMessage } from './types';
import { createSeededRandom, cyrb128 } from '../utils/random';

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
  currentChannel: "system",
  
  discoveredClueIds: [],
  collectedEvidenceIds: [],
  completedCaseIds: [],
  
  pendingConsequences: [],

  decisions: [],
  messageHistory: [],
  unlockedCodexIds: [],
  earnedBadgeIds: [],
  
  status: "intro",
  endingId: null,
  schemaVersion: 1
};

function generateId(seed: string, index: number) {
  const hash = cyrb128(seed + "-" + index);
  return hash[0].toString(36) + hash[1].toString(36);
}

function calculateDayProgress(h: number, m: number) {
    const totalMinutes = h * 60 + m;
    const startMinutes = 7 * 60 + 30;
    const endMinutes = 24 * 60;
    return Math.max(0, Math.min(1, (totalMinutes - startMinutes) / (endMinutes - startMinutes)));
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case "START_RUN": {
      const seed = action.payload.seed || Date.now().toString();
      const sessionId = generateId(seed, 0);
      return {
        ...INITIAL_STATE,
        sessionId,
        seed,
        mode: action.payload.mode,
        difficulty: action.payload.difficulty,
        status: "playing"
      };
    }
      
    case "RECEIVE_EVENT":
      return {
        ...state,
        currentCaseId: action.payload.caseId,
        currentSceneId: action.payload.sceneId,
        currentChannel: action.payload.channel,
        messageHistory: action.payload.message ? [
          ...state.messageHistory,
          {
            id: generateId(state.seed, state.messageHistory.length),
            sender: "attacker",
            text: action.payload.message,
            timestamp: state.currentTime
          }
        ] : state.messageHistory
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
        id: generateId(state.seed, state.decisions.length),
        caseId: state.currentCaseId!,
        sceneId: state.currentSceneId!,
        actionId: action.payload.actionId,
        timestamp: state.currentTime,
        safe: action.payload.safe,
        scoreDelta: action.payload.scoreDelta || 0
      };
      
      const newWallet = Math.max(0, Math.min(100, state.walletShield + (action.payload.walletDelta || 0)));
      const newIdentity = Math.max(0, Math.min(100, state.identityShield + (action.payload.identityDelta || 0)));
      const newFamily = Math.max(0, Math.min(100, state.familyTrust + (action.payload.familyDelta || 0)));
      const newPressure = Math.max(0, Math.min(100, state.pressure + (action.payload.pressureDelta || 0)));
      
      let nextState = {
        ...state,
        decisions: [...state.decisions, decision],
        walletShield: newWallet,
        identityShield: newIdentity,
        familyTrust: newFamily,
        pressure: newPressure,
        status: action.payload.nextStatus || state.status,
        currentSceneId: action.payload.nextSceneId !== undefined ? action.payload.nextSceneId : state.currentSceneId,
      };

      if (action.payload.schedulesConsequences) {
          nextState.pendingConsequences = [
              ...nextState.pendingConsequences,
              ...action.payload.schedulesConsequences
          ];
      }

      if (action.payload.revealsClueIds) {
          const newClues = action.payload.revealsClueIds.filter(id => !nextState.discoveredClueIds.includes(id));
          if (newClues.length > 0) {
              nextState.discoveredClueIds = [...nextState.discoveredClueIds, ...newClues];
              nextState.collectedEvidenceIds = [...nextState.collectedEvidenceIds, ...newClues];
          }
      }

      // If time advancement is bundled with action
      if (action.payload.timeMinutes) {
          const [h, m] = nextState.currentTime.split(":").map(Number);
          let newM = m + action.payload.timeMinutes;
          let newH = h + Math.floor(newM / 60);
          newM = newM % 60;
          nextState.currentTime = `${newH.toString().padStart(2, '0')}:${newM.toString().padStart(2, '0')}`;
          nextState.dayProgress = calculateDayProgress(newH, newM);
      }

      return nextState;
    }
      
    case "SUBMIT_REPLY":
      return {
        ...state,
        status: "awaiting_ai",
        messageHistory: [
          ...state.messageHistory,
          {
            id: generateId(state.seed, state.messageHistory.length),
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
            id: generateId(state.seed, state.messageHistory.length),
            sender: "attacker",
            text: action.payload.message,
            timestamp: state.currentTime,
            isFallback: action.type === "APPLY_FALLBACK_RESPONSE"
          }
        ]
      };
      
    case "ADVANCE_TIME": {
      const [h, m] = state.currentTime.split(":").map(Number);
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
        timeSlot: newTimeSlot,
        dayProgress: calculateDayProgress(newH, newM)
      };
    }
    
    case "TRIGGER_CONSEQUENCE":
      return {
          ...state,
          currentCaseId: action.payload.caseId,
          currentSceneId: action.payload.sceneId,
          pendingConsequences: state.pendingConsequences.filter(c => !(c.caseId === action.payload.caseId && c.sceneId === action.payload.sceneId))
      };

    case "COMPLETE_CASE":
      return {
        ...state,
        completedCaseIds: [...state.completedCaseIds, action.payload.caseId],
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
