import { CampaignState, GameAction, ScheduledEvent } from './types';
import { cyrb128 } from '../../utils/random';

export const INITIAL_STATE: CampaignState = {
  schemaVersion: 2,
  seed: "",
  mode: "solo",
  day: 1,
  minuteOfDay: 7 * 60, // 07:00
  speed: 0,
  location: "apartment",
  phase: "morning",
  
  credits: 70,
  hunger: 75,
  energy: 80,
  agencyTrust: 55,
  networkHeat: 0,
  
  rentAmount: 120,
  rentDueDay: 3,
  rentPaid: false,
  internetPaidThroughDay: 0,
  
  inventory: [{ id: 'food_1', name: 'Mì ly', type: 'food', effectValue: 25 }, { id: 'food_2', name: 'Mì ly', type: 'food', effectValue: 25 }],
  upgrades: [],
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
  return Math.max(min, Math.min(max, val));
}

function processEvent(state: CampaignState, event: ScheduledEvent): CampaignState {
  if (state.processedEventIds.includes(event.id)) return state;
  const nextState = { ...state, processedEventIds: [...state.processedEventIds, event.id] };
  
  switch (event.type) {
    case "feed_start": {
      const { feedId, title, type } = event.payload;
      nextState.feeds = {
        ...nextState.feeds,
        [feedId]: { id: feedId, title, type, status: "active", messages: [] }
      };
      nextState.notifications = [...nextState.notifications, { id: `notif_${event.id}`, time: state.minuteOfDay, message: `Tín hiệu mới: ${title}`, type: "warning" }];
      break;
    }
    case "feed_message": {
      const { feedId, message } = event.payload;
      const feed = nextState.feeds[feedId];
      if (feed && feed.status === "active") {
        nextState.feeds = {
          ...nextState.feeds,
          [feedId]: { ...feed, messages: [...feed.messages, message] }
        };
      }
      break;
    }
    // Handle other events as needed
  }
  return nextState;
}

export function gameReducer(state: CampaignState, action: GameAction): CampaignState {
  switch (action.type) {
    case "CREATE_CASE": {
      if (state.cases[action.payload.id]) return state;
      return {
        ...state,
        cases: {
          ...state.cases,
          [action.payload.id]: { id: action.payload.id, title: action.payload.title, status: "open", evidenceIds: [], verdict: null }
        },
        notifications: [...state.notifications, { id: `notif_${state.day}_${state.minuteOfDay}_${state.notifications.length}`, time: state.minuteOfDay, message: `Hồ sơ mới được tạo: ${action.payload.title}`, type: "info" }]
      };
    }
    case "START_CAMPAIGN": {
      const seed = action.payload.seed || Math.random().toString(36).substring(2, 9);
      const isDemo = action.payload.mode === "demo";
      
      let scheduledEvents: ScheduledEvent[] = [];
      
      if (isDemo) {
        // Demo starts immediately with 2 feeds active
        scheduledEvents.push(
          { id: "demo_start_1", day: 1, minute: 7 * 60, type: "feed_start" as const, payload: { feedId: "c1_qr_delivery", title: "Mã QR Giao hàng", type: "chat" as const } },
          { id: "demo_msg_1", day: 1, minute: 7 * 60 + 1, type: "feed_message" as const, payload: { feedId: "c1_qr_delivery", message: { id: "m_demo_1", senderId: "scammer", senderName: "Shipper Giao Hàng Nhanh", text: "Chào bạn, tôi là shipper. Bạn có đơn hàng 250k. Vui lòng quét mã QR này để thanh toán vì tôi đang vội.", timestamp: 7 * 60 + 1, clues: ["mã QR này", "đang vội"] } } },
          { id: "demo_start_2", day: 1, minute: 7 * 60, type: "feed_start" as const, payload: { feedId: "c3_bank_impersonation", title: "Mạo danh ngân hàng", type: "call" as const } },
          { id: "demo_msg_2", day: 1, minute: 7 * 60 + 1, type: "feed_message" as const, payload: { feedId: "c3_bank_impersonation", message: { id: "m_demo_2", senderId: "scammer", senderName: "0287300xxxx", text: "Tài khoản của anh/chị vừa bị trừ 5 triệu. Đọc mã OTP gửi về máy để hủy giao dịch.", timestamp: 7 * 60 + 1, clues: ["đọc mã OTP", "bị trừ 5 triệu"] } } }
        );
      } else {
        // Solo mode schedules first feed very soon (in 1-2 in-game minutes)
        scheduledEvents.push(
          { id: "solo_start_1", day: 1, minute: 7 * 60 + 3, type: "feed_start" as const, payload: { feedId: "c1_qr_delivery", title: "Mã QR Giao hàng", type: "chat" as const } },
          { id: "solo_msg_1", day: 1, minute: 7 * 60 + 4, type: "feed_message" as const, payload: { feedId: "c1_qr_delivery", message: { id: "m_solo_1", senderId: "scammer", senderName: "Shipper Giao Hàng Nhanh", text: "Chào bạn, tôi là shipper. Bạn có đơn hàng 250k. Vui lòng quét mã QR này để thanh toán vì tôi đang vội.", timestamp: 7 * 60 + 4, clues: ["mã QR này", "đang vội"] } } }
        );
      }
      
      return {
        ...INITIAL_STATE,
        seed,
        mode: action.payload.mode,
        internetPaidThroughDay: 0,
        status: "playing",
        location: isDemo ? "workstation" : "apartment",
        speed: isDemo ? 0 : 0,
        scheduledEvents
      };
    }
    case "SET_SPEED": {
      return { ...state, speed: action.payload.speed };
    }
    case "TICK": {
      if (state.status !== "playing" || state.speed === 0) return state;
      let newMinute = state.minuteOfDay + action.payload.minutes;
      
      let nextState = { ...state };
      
      // Calculate how many 10-minute intervals passed
      const oldIntervals = Math.floor(state.minuteOfDay / 10);
      const newIntervals = Math.floor(newMinute / 10);
      const intervalsPassed = newIntervals - oldIntervals;
      
      if (intervalsPassed > 0) {
        nextState.hunger = clamp(nextState.hunger - 0.5 * intervalsPassed, 0, 100);
        nextState.energy = clamp(nextState.energy - 0.5 * intervalsPassed, 0, 100);
      }
      
      // Process events that trigger in this window
      const eventsToFire = nextState.scheduledEvents.filter(e => e.day === nextState.day && e.minute <= newMinute && !nextState.processedEventIds.includes(e.id));
      for (const e of eventsToFire) {
        nextState = processEvent(nextState, e);
      }
      
      nextState.minuteOfDay = newMinute;
      
      // Auto-pause if ending day?
      if (nextState.minuteOfDay >= 24 * 60) {
        nextState.minuteOfDay = 24 * 60 - 1;
        nextState.speed = 0;
      }
      
      return nextState;
    }
    case "PROCESS_EVENT": {
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
      return {
        ...state,
        evidence: [...state.evidence, action.payload.token],
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
      if (!item) return state;
      const newInv = [...state.inventory];
      newInv.splice(itemIndex, 1);
      return {
        ...state,
        inventory: newInv,
        hunger: clamp(state.hunger + item.effectValue, 0, 100)
      };
    }
    case "SLEEP": {
      // End day transition
      return {
        ...state,
        phase: "sleep",
        energy: clamp(state.energy + 80, 0, 100),
        speed: 0
      };
    }
    case "END_DAY": {
      const nextDay = state.day + 1;
      let ending = state.status;
      let speed = state.speed;
      let unlocked = [...state.endingsUnlocked];
      let networkHeat = state.networkHeat;
      
      // Rent check
      if (state.day === state.rentDueDay && !state.rentPaid) {
        ending = "debrief";
        speed = 0;
        unlocked.push("e_nguoi_tot_khong_nha");
      }
      
      // Health check
      if (state.hunger <= 0 || state.energy <= 0) {
        ending = "debrief";
        speed = 0;
        unlocked.push("e_kiet_suc");
      }
      
      return {
        ...state,
        day: nextDay,
        minuteOfDay: 7 * 60,
        phase: "morning",
        status: ending,
        endingsUnlocked: unlocked,
        speed: speed
      };
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
      if (prog >= state.activeSideJob.maxProgress) {
        // finished job
        return {
          ...state,
          credits: state.credits + state.activeSideJob.reward,
          activeSideJob: null,
          notifications: [...state.notifications, { id: `job_${state.day}_${state.minuteOfDay}_${state.notifications.length}`, time: state.minuteOfDay, message: `Hoàn thành công việc: +${state.activeSideJob.reward} CR`, type: "success" }]
        };
      }
      return {
        ...state,
        activeSideJob: { ...state.activeSideJob, progress: prog }
      };
    }
    case "OPERATIONAL_ACTION": {
      const { caseId, action: opAction } = action.payload;
      const c = state.cases[caseId];
      if (!c) return state;
      
      let ending = state.status;
      let speed = state.speed;
      if (state.mode === 'demo') {
         ending = 'debrief';
         speed = 0;
      }
      
      // Simple resolution logic for now
      let trustDelta = 0;
      let creditsDelta = 0;
      
      if (opAction === "warned") {
        trustDelta = 5;
        creditsDelta = 20;
      } else if (opAction === "frozen") {
        trustDelta = 10;
        creditsDelta = 30;
      } else if (opAction === "banned") {
        trustDelta = 15;
        creditsDelta = 40;
      }
      
      return {
        ...state,
        cases: {
          ...state.cases,
          [caseId]: { ...c, status: "resolved", verdict: opAction }
        },
        agencyTrust: clamp(state.agencyTrust + trustDelta, 0, 100),
        credits: state.credits + creditsDelta,
        notifications: [...state.notifications, { id: `case_${caseId}`, time: state.minuteOfDay, message: `Vụ án xử lý: ${opAction} (+${creditsDelta} CR)`, type: "success" }]
      };
    }
    default:
      return state;
  }
}
