import { CampaignState, GameAction, ScheduledEvent, FeedMessage, FeedState, CaseFileState } from './types';
import { SCENARIOS } from '../content/scenarios';

export const INITIAL_STATE: CampaignState = {
  seed: "initial",
  mode: "solo",
  day: 1,
  minuteOfDay: 7 * 60, // 07:00
  speed: 0,
  location: "apartment",
  phase: "morning",
  credits: 100,
  hunger: 100,
  energy: 100,
  agencyTrust: 50,
  networkHeat: 0,
  rentAmount: 300,
  rentDueDay: 3,
  rentPaid: false,
  internetPaidThroughDay: 0,
  inventory: [
    { id: "i1", name: "Lương khô", type: "food", effectValue: 30 },
    { id: "i2", name: "Cà phê đen", type: "food", effectValue: 15 }
  ],
  upgrades: {},
  activeSideJob: null,
  feeds: {},
  cases: {},
  evidence: [],
  graphEdges: [],
  victims: {},
  scheduledEvents: [],
  processedEventIds: [],
  notifications: [],
  dailyReports: [],
  endingsUnlocked: [],
  status: "playing"
};

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

function processEvent(state: CampaignState, event: ScheduledEvent): CampaignState {
  const next = { ...state, processedEventIds: [...state.processedEventIds, event.id] };
  
  if (event.type === "feed_start") {
    next.feeds = {
      ...next.feeds,
      [event.payload.feedId]: {
        id: event.payload.feedId,
        title: event.payload.title,
        type: event.payload.type,
        status: "active",
        messages: []
      }
    };
    
    // Auto-create case
    next.cases = {
      ...next.cases,
      [event.payload.feedId]: {
        id: event.payload.feedId,
        title: event.payload.title,
        status: "open",
        evidenceIds: [],
        verdict: null
      }
    };
    
    next.notifications = [...next.notifications, {
      id: `notif_${event.id}`,
      time: state.minuteOfDay,
      message: `Tín hiệu mới: ${event.payload.title}`,
      type: "warning"
    }];
  } else if (event.type === "feed_message") {
    const feed = next.feeds[event.payload.feedId];
    if (feed) {
      next.feeds = {
        ...next.feeds,
        [feed.id]: {
          ...feed,
          messages: [...feed.messages, event.payload.message]
        }
      };
    }
  } else if (event.type === "feed_close") {
    const feed = next.feeds[event.payload.feedId];
    if (feed) {
      next.feeds = {
        ...next.feeds,
        [feed.id]: {
          ...feed,
          status: "closed"
        }
      };
    }
  } else if (event.type === "network_activity") {
     next.networkHeat = clamp(next.networkHeat + event.payload.heatDelta, 0, 100);
  }
  return next;
}

function advanceDay(state: CampaignState): CampaignState {
  const nextDay = state.day + 1;
  let ending = state.status;
  let speed = state.speed;
  let unlocked = [...state.endingsUnlocked];

  // Daily report
  const dailyReport = {
    day: state.day,
    salaryEarned: 0,
    expenses: 0,
    casesResolved: Object.values(state.cases).filter(c => c.status !== "open").length, // Simplification
    falsePositives: 0,
    victimsProtected: 0,
    summary: `Kết thúc ngày ${state.day}.`
  };

  // Rent check
  let nextCredits = state.credits;
  let rentPaid = state.rentPaid;
  if (state.day >= state.rentDueDay && !state.rentPaid) {
    if (nextCredits >= state.rentAmount) {
       nextCredits -= state.rentAmount;
       rentPaid = true;
       // auto paid
    } else {
       ending = "debrief";
       speed = 0;
       unlocked.push("e_nguoi_tot_khong_nha");
    }
  }

  // Health check
  if (state.hunger <= 0 || state.energy <= 0) {
    ending = "debrief";
    speed = 0;
    unlocked.push("e_kiet_suc");
  }

  if (nextDay > 3 && ending !== "debrief") {
     ending = "debrief";
     speed = 0;
     unlocked.push("e_luoi_khep_kin");
  }

  return {
    ...state,
    day: nextDay,
    minuteOfDay: 7 * 60,
    phase: "morning",
    speed: speed,
    status: ending,
    endingsUnlocked: unlocked,
    dailyReports: [...state.dailyReports, dailyReport],
    credits: nextCredits,
    rentPaid: rentPaid,
    activeSideJob: null // reset side job daily
  };
}

export function campaignReducer(state: CampaignState, action: GameAction): CampaignState {
  switch (action.type) {
    case "START_CAMPAIGN": {
      const mode = action.payload.mode;
      const seed = action.payload.seed || Date.now().toString();
      
      let nextState = { 
        ...INITIAL_STATE, 
        mode, 
        seed, 
        status: "playing" as const,
        location: (mode === "demo" ? "workstation" : "apartment") as "apartment" | "workstation",
        speed: (mode === "demo" ? 1 : 0) as 0|1|2|4
      };

      const scheduleScenario = (id: string, startMinute: number) => {
         const scen = SCENARIOS[id];
         if (!scen) return;
         nextState.scheduledEvents.push({
           id: `start_${id}`, day: 1, minute: startMinute, type: "feed_start",
           payload: { feedId: id, title: scen.title, type: scen.type }
         });
         
         let currentMin = startMinute;
         scen.beats.forEach((beat, idx) => {
            currentMin += beat.waitBefore;
            nextState.scheduledEvents.push({
               id: `msg_${id}_${idx}`, day: 1, minute: currentMin, type: "feed_message",
               payload: {
                  feedId: id,
                  message: {
                     id: beat.id, senderId: beat.sender, senderName: beat.senderName,
                     text: beat.text, timestamp: currentMin, clues: beat.clues
                  }
               }
            });
         });
      };

      if (mode === "demo") {
        scheduleScenario("c1_qr_delivery", 7 * 60 + 1);
        scheduleScenario("c2_legit_shipper", 7 * 60 + 2);
      } else {
        // Solo mode: starts at 7:00, wait a few minutes
        scheduleScenario("c1_qr_delivery", 7 * 60 + 5);
        scheduleScenario("c2_legit_shipper", 7 * 60 + 15);
      }
      return nextState;
    }
    
    case "SET_SPEED": {
      return { ...state, speed: action.payload.speed };
    }
    
    case "TICK": {
      if (state.status !== "playing" || state.speed === 0) return state;
      let newMinute = state.minuteOfDay + action.payload.minutes;
      
      let nextState = { ...state };
      
      // Calculate hunger/energy drain
      const oldIntervals = Math.floor(state.minuteOfDay / 10);
      const newIntervals = Math.floor(newMinute / 10);
      const intervalsPassed = newIntervals - oldIntervals;
      
      if (intervalsPassed > 0) {
        nextState.hunger = clamp(nextState.hunger - 0.5 * intervalsPassed, 0, 100);
        nextState.energy = clamp(nextState.energy - 0.5 * intervalsPassed, 0, 100);
      }
      
      // Process events
      const eventsToFire = nextState.scheduledEvents.filter(e => e.day === nextState.day && e.minute <= newMinute && !nextState.processedEventIds.includes(e.id));
      for (const e of eventsToFire) {
        nextState = processEvent(nextState, e);
      }
      
      nextState.minuteOfDay = newMinute;
      
      if (nextState.minuteOfDay >= 24 * 60) {
        nextState.minuteOfDay = 24 * 60 - 1;
        nextState.speed = 0;
      }
      
      return nextState;
    }
    
    case "PROCESS_EVENT": {
      if (state.processedEventIds.includes(action.payload.event.id)) return state;
      return processEvent(state, action.payload.event);
    }
    
    case "CHANGE_LOCATION": {
      return { ...state, location: action.payload.location };
    }
    
    case "CHANGE_PHASE": {
      return { ...state, phase: action.payload.phase };
    }
    
    case "EXTRACT_EVIDENCE": {
      if (state.evidence.find(e => e.id === action.payload.token.id)) return state;
      
      // auto-assign to case if feedId matches caseId
      const caseId = action.payload.token.feedId;
      const c = state.cases[caseId];
      
      let nextCases = state.cases;
      if (c) {
         nextCases = {
            ...state.cases,
            [caseId]: { ...c, evidenceIds: [...c.evidenceIds, action.payload.token.id] }
         };
      }
      
      return {
        ...state,
        cases: nextCases,
        evidence: [...state.evidence, { ...action.payload.token, caseId: c ? caseId : null }],
        notifications: [...state.notifications, { id: `ev_${action.payload.token.id}`, time: state.minuteOfDay, message: `Trích xuất bằng chứng: ${action.payload.token.label}`, type: "info" }]
      };
    }
    
    case "ASSIGN_EVIDENCE": {
      const { evidenceId, caseId } = action.payload;
      const c = state.cases[caseId];
      if (!c) return state;
      if (c.evidenceIds.includes(evidenceId)) return state;
      return {
        ...state,
        cases: {
          ...state.cases,
          [caseId]: { ...c, evidenceIds: [...c.evidenceIds, evidenceId] }
        },
        evidence: state.evidence.map(e => e.id === evidenceId ? { ...e, caseId } : e)
      };
    }
    
    case "LINK_EVIDENCE": {
      const edge = action.payload;
      return {
        ...state,
        graphEdges: [...state.graphEdges, { id: `${edge.sourceId}_${edge.targetId}`, ...edge }]
      };
    }
    
    case "EAT": {
      const itemIndex = state.inventory.findIndex(i => i.id === action.payload.itemId);
      if (itemIndex === -1) return state;
      const item = state.inventory[itemIndex];
      const newInv = [...state.inventory];
      newInv.splice(itemIndex, 1);
      return {
        ...state,
        inventory: newInv,
        hunger: clamp(state.hunger + item!.effectValue, 0, 100)
      };
    }
    
    case "BUY_ITEM": {
      if (state.credits < action.payload.cost) return state;
      return {
        ...state,
        credits: state.credits - action.payload.cost,
        inventory: [...state.inventory, action.payload.item]
      };
    }
    
    case "SLEEP": {
      let nextState = { ...state, energy: clamp(state.energy + 80, 0, 100), phase: "sleep" as const };
      return advanceDay(nextState);
    }
    
    case "END_DAY": {
      return advanceDay(state);
    }
    
    case "PAY_RENT": {
      if (state.credits >= state.rentAmount && !state.rentPaid) {
        return { ...state, credits: state.credits - state.rentAmount, rentPaid: true };
      }
      return state;
    }
    
    case "PAY_INTERNET": {
      if (state.credits >= 12 && state.internetPaidThroughDay < state.day) {
        return { ...state, credits: state.credits - 12, internetPaidThroughDay: state.day };
      }
      return state;
    }
    
    case "START_JOB": {
      return { ...state, activeSideJob: action.payload.job };
    }
    
    case "WORK_JOB": {
      if (!state.activeSideJob) return state;
      const prog = clamp(state.activeSideJob.progress + action.payload.progress, 0, state.activeSideJob.maxProgress);
      
      // working costs energy and time
      const energyCost = 5 * action.payload.progress;
      const timeCost = 30 * action.payload.progress;
      
      let next = { 
         ...state, 
         energy: clamp(state.energy - energyCost, 0, 100),
        minuteOfDay: Math.min(state.minuteOfDay + timeCost, 24 * 60 - 1)
      };

      if (prog >= state.activeSideJob.maxProgress) {
        return {
          ...next,
          credits: next.credits + state.activeSideJob.reward,
          activeSideJob: null, // job is done for the day
          notifications: [...next.notifications, { id: `job_${next.day}_${next.minuteOfDay}`, time: next.minuteOfDay, message: `Hoàn thành công việc: +${state.activeSideJob.reward} CR`, type: "success" }]
        };
      }
      return {
        ...next,
        activeSideJob: { ...state.activeSideJob, progress: prog }
      };
    }
    
    case "OPERATIONAL_ACTION": {
      const { caseId, action: opAction } = action.payload;
      const c = state.cases[caseId];
      
      if (!c || c.status !== "open") return state;
      
      // Exploit prevention check
      let isValid = false;
      let errorReason = "";
      
      // get assigned evidence
      const caseEvidence = state.evidence.filter(e => c.evidenceIds.includes(e.id));
      const entityTypes = new Set(caseEvidence.map(e => e.entityType));
      
      // check links involving these evidence
      const hasLink = state.graphEdges.some(edge => 
         c.evidenceIds.includes(edge.sourceId) || c.evidenceIds.includes(edge.targetId)
      );

      if (opAction === "warned") {
        if (caseEvidence.length >= 1) isValid = true;
        else errorReason = "Cần ít nhất 1 bằng chứng";
      } else if (opAction === "frozen") {
        if (caseEvidence.length >= 2 && hasLink) isValid = true;
        else errorReason = "Cần ít nhất 2 bằng chứng và 1 liên kết";
      } else if (opAction === "banned" || opAction === "escalated") {
        if (caseEvidence.length >= 3 && entityTypes.size >= 2) isValid = true;
        else errorReason = "Cần ít nhất 3 bằng chứng và 2 loại thực thể khác nhau";
      } else if (opAction === "ignored") {
        isValid = true;
      }
      
      if (!isValid) { 
         // Return state with notification
         return {
           ...state,
           notifications: [...state.notifications, { id: `err_${state.minuteOfDay}`, time: state.minuteOfDay, message: `Từ chối: ${errorReason}`, type: "error" }]
         };
      }

      let trustDelta = 0;
      let creditsDelta = 0;

      // Simple scoring based on the scenario ID being a scam or legit.
      // E.g., c2_legit_shipper is legit. Freezing/banning them is a false positive.
      if (caseId === "c2_legit_shipper") {
         if (opAction !== "ignored") {
             trustDelta = -10;
             creditsDelta = -50;
         } else {
             trustDelta = +5;
             creditsDelta = +10;
         }
      } else {
         if (opAction === "warned") {
           trustDelta = 5;
           creditsDelta = 20;
         } else if (opAction === "frozen") {
           trustDelta = 10;
           creditsDelta = 30;
         } else if (opAction === "banned" || opAction === "escalated") {
           trustDelta = 15;
           creditsDelta = 40;
         } else if (opAction === "ignored") {
           trustDelta = -10;
         }
      }

      return {
        ...state,
        cases: {
          ...state.cases,
          [caseId]: { ...c, status: "resolved", verdict: opAction }
        },
        agencyTrust: clamp((state.agencyTrust || 50) + trustDelta, 0, 100),
        credits: state.credits + creditsDelta,
        notifications: [...state.notifications, { id: `case_${caseId}`, time: state.minuteOfDay, message: `Vụ án xử lý: ${opAction} (${creditsDelta > 0 ? '+' : ''}${creditsDelta} CR)`, type: "success" }]
      };
    }
    
    default:
      return state;
  }
}
