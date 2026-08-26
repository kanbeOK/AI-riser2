import { DAY_SCENARIOS, SCENARIOS, getDayScenarioIds } from "../content/scenarios";
import type {
  CampaignState,
  CaseFileState,
  DayStats,
  EvidenceToken,
  FeedState,
  GameAction,
  GameNotification,
  ScheduledEvent,
  Verdict,
} from "./types";

export const SHIFT_START_MINUTE = 19 * 60;

const EMPTY_DAY_STATS: DayStats = {
  salaryEarned: 0,
  expenses: 0,
  casesResolved: 0,
  falsePositives: 0,
  victimsProtected: 0,
};

export const INITIAL_STATE: CampaignState = {
  seed: "initial",
  mode: "solo",
  status: "playing",
  phase: "morning",
  location: "apartment",
  day: 1,
  minuteOfDay: SHIFT_START_MINUTE,
  speed: 0,
  shiftStartedDays: [],

  credits: 120,
  hunger: 78,
  energy: 88,
  agencyTrust: 50,
  networkHeat: 18,

  rentAmount: 180,
  rentDueDay: 3,
  rentPaid: false,
  internetPaidThroughDay: 1,
  inventory: [
    { id: "food_ration_1", name: "Mì hộp", type: "food", effectValue: 24 },
    { id: "food_coffee_1", name: "Cà phê", type: "food", effectValue: 12 },
  ],
  activeSideJob: null,
  completedSideJobDays: [],

  feeds: {},
  cases: {},
  evidence: [],
  graphEdges: [],
  victims: {},
  scheduledEvents: [],
  processedEventIds: [],
  notifications: [],

  dayStats: { ...EMPTY_DAY_STATS },
  dailyReports: [],
  endingsUnlocked: [],
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function notification(
  state: CampaignState,
  message: string,
  type: GameNotification["type"],
): GameNotification {
  return {
    id: `n_${state.day}_${state.minuteOfDay}_${state.notifications.length}_${type}`,
    time: state.minuteOfDay,
    message,
    type,
  };
}

function eventPriority(event: ScheduledEvent): number {
  switch (event.type) {
    case "feed_start":
      return 0;
    case "feed_message":
      return 1;
    case "network_activity":
      return 2;
    case "feed_deadline":
      return 3;
  }
}

function sortEvents(events: ScheduledEvent[]): ScheduledEvent[] {
  return [...events].sort(
    (a, b) => a.minute - b.minute || eventPriority(a) - eventPriority(b) || a.id.localeCompare(b.id),
  );
}

export function buildScenarioEvents(
  scenarioId: string,
  day: number,
  startMinute: number,
): ScheduledEvent[] {
  const scenario = SCENARIOS[scenarioId];
  if (!scenario) return [];

  const events: ScheduledEvent[] = [
    {
      id: `d${day}_${scenarioId}_start`,
      day,
      minute: startMinute,
      type: "feed_start",
      payload: {
        feedId: scenarioId,
        title: scenario.title,
        feedType: scenario.type,
        deadlineMinute: startMinute + scenario.deadlineMinutes,
        victimId: scenario.victim.id,
        victimName: scenario.victim.name,
        moneyAtRisk: scenario.victim.moneyAtRisk,
      },
    },
  ];

  let beatMinute = startMinute;
  scenario.beats.forEach((beat, index) => {
    beatMinute += beat.waitBefore;
    events.push({
      id: `d${day}_${scenarioId}_${beat.id}_${index}`,
      day,
      minute: beatMinute,
      type: "feed_message",
      payload: {
        feedId: scenarioId,
        message: {
          id: `${scenarioId}_${beat.id}`,
          senderId: beat.sender,
          senderName: beat.senderName,
          text: beat.text,
          timestamp: beatMinute,
          clues: beat.clues,
        },
      },
    });
  });

  events.push({
    id: `d${day}_${scenarioId}_deadline`,
    day,
    minute: startMinute + scenario.deadlineMinutes,
    type: "feed_deadline",
    payload: { feedId: scenarioId },
  });

  return sortEvents(events);
}

export function buildDaySchedule(
  day: number,
  startMinute: number,
  immediate = false,
): ScheduledEvent[] {
  const ids = getDayScenarioIds(day);
  const offsets = immediate ? [0, 0] : [1, 4];
  const events = ids.flatMap((id, index) =>
    buildScenarioEvents(id, day, startMinute + (offsets[index] ?? index + 1)),
  );

  if (day === 3) {
    events.push({
      id: "d3_coxam_network_activity",
      day: 3,
      minute: startMinute + 6,
      type: "network_activity",
      payload: {
        heatDelta: 8,
        message: "CÒ XÁM đang di chuyển hạ tầng. Thời gian xác minh bị thu hẹp.",
      },
    });
  }

  return sortEvents(events);
}

function processEvent(state: CampaignState, event: ScheduledEvent): CampaignState {
  if (state.processedEventIds.includes(event.id)) return state;

  let next: CampaignState = {
    ...state,
    processedEventIds: [...state.processedEventIds, event.id],
  };

  switch (event.type) {
    case "feed_start": {
      if (next.feeds[event.payload.feedId]) return next;

      const feed: FeedState = {
        id: event.payload.feedId,
        day: event.day,
        title: event.payload.title,
        type: event.payload.feedType,
        status: "active",
        messages: [],
        startedAt: event.minute,
        deadlineMinute: event.payload.deadlineMinute,
        risk: 12,
      };
      const caseFile: CaseFileState = {
        id: event.payload.feedId,
        day: event.day,
        title: event.payload.title,
        status: "open",
        evidenceIds: [],
        verdict: null,
        resolvedAt: null,
      };

      next = {
        ...next,
        feeds: { ...next.feeds, [feed.id]: feed },
        cases: { ...next.cases, [caseFile.id]: caseFile },
        victims: {
          ...next.victims,
          [event.payload.victimId]: {
            id: event.payload.victimId,
            scenarioId: event.payload.feedId,
            name: event.payload.victimName,
            status: "at_risk",
            moneyAtRisk: event.payload.moneyAtRisk,
          },
        },
        notifications: [
          ...next.notifications,
          notification(next, `Tín hiệu mới: ${event.payload.title}`, "warning"),
        ],
      };
      return next;
    }

    case "feed_message": {
      const feed = next.feeds[event.payload.feedId];
      if (!feed || feed.messages.some((message) => message.id === event.payload.message.id)) return next;

      const riskDelta = event.payload.message.senderId === "scammer" ? 9 : 3;
      return {
        ...next,
        feeds: {
          ...next.feeds,
          [feed.id]: {
            ...feed,
            messages: [...feed.messages, event.payload.message],
            risk: clamp(feed.risk + riskDelta, 0, 100),
          },
        },
      };
    }

    case "network_activity": {
      return {
        ...next,
        networkHeat: clamp(next.networkHeat + event.payload.heatDelta, 0, 100),
        notifications: [
          ...next.notifications,
          notification(next, event.payload.message, "warning"),
        ],
      };
    }

    case "feed_deadline": {
      const feed = next.feeds[event.payload.feedId];
      const caseFile = next.cases[event.payload.feedId];
      const scenario = SCENARIOS[event.payload.feedId];
      if (!feed || !caseFile || !scenario || caseFile.status !== "open") return next;

      const victim = next.victims[scenario.victim.id];
      const isScam = scenario.isScam;
      return {
        ...next,
        feeds: {
          ...next.feeds,
          [feed.id]: { ...feed, status: isScam ? "failed" : "resolved", risk: 100 },
        },
        cases: {
          ...next.cases,
          [caseFile.id]: {
            ...caseFile,
            status: isScam ? "failed" : "resolved",
            verdict: "ignored",
            resolvedAt: event.minute,
          },
        },
        victims: victim
          ? {
              ...next.victims,
              [victim.id]: { ...victim, status: isScam ? "scammed" : "safe" },
            }
          : next.victims,
        agencyTrust: clamp(next.agencyTrust + (isScam ? -8 : 2), 0, 100),
        networkHeat: clamp(next.networkHeat + (isScam ? 8 : 0), 0, 100),
        dayStats: {
          ...next.dayStats,
          casesResolved: next.dayStats.casesResolved + 1,
        },
        notifications: [
          ...next.notifications,
          notification(
            next,
            isScam
              ? `Quá hạn: ${scenario.victim.name} đã thực hiện giao dịch.`
              : `Đã xác minh ${scenario.title} là tín hiệu hợp pháp.`,
            isScam ? "error" : "info",
          ),
        ],
      };
    }
  }
}

export function processEventsThrough(state: CampaignState, targetMinute: number): CampaignState {
  const due = sortEvents(
    state.scheduledEvents.filter(
      (event) =>
        event.day === state.day &&
        event.minute <= targetMinute &&
        !state.processedEventIds.includes(event.id),
    ),
  );

  return due.reduce((current, event) => processEvent(current, event), state);
}

function freshCampaign(mode: CampaignState["mode"], seed: string): CampaignState {
  let next: CampaignState = {
    ...INITIAL_STATE,
    seed,
    mode,
    phase: mode === "demo" ? "shift" : "morning",
    location: mode === "demo" ? "workstation" : "apartment",
    speed: mode === "demo" ? 1 : 0,
    shiftStartedDays: mode === "demo" ? [1] : [],
    inventory: INITIAL_STATE.inventory.map((item) => ({ ...item })),
    dayStats: { ...EMPTY_DAY_STATS },
    feeds: {},
    cases: {},
    evidence: [],
    graphEdges: [],
    victims: {},
    processedEventIds: [],
    notifications: [],
    dailyReports: [],
    endingsUnlocked: [],
    completedSideJobDays: [],
  };

  next.scheduledEvents = buildDaySchedule(1, SHIFT_START_MINUTE, mode === "demo");
  if (mode === "demo") next = processEventsThrough(next, SHIFT_START_MINUTE);
  return next;
}

function hasValidGraphLink(state: CampaignState, evidenceIds: string[]): boolean {
  return state.graphEdges.some(
    (edge) => evidenceIds.includes(edge.sourceId) && evidenceIds.includes(edge.targetId),
  );
}

function closeOpenCasesForDay(state: CampaignState): CampaignState {
  let trustDelta = 0;
  let heatDelta = 0;
  let resolvedDelta = 0;
  const nextCases = { ...state.cases };
  const nextFeeds = { ...state.feeds };
  const nextVictims = { ...state.victims };

  getDayScenarioIds(state.day).forEach((scenarioId) => {
    const scenario = SCENARIOS[scenarioId];
    const caseFile = nextCases[scenarioId];
    const feed = nextFeeds[scenarioId];
    if (!scenario || !caseFile || caseFile.status !== "open") return;

    const failed = scenario.isScam;
    nextCases[scenarioId] = {
      ...caseFile,
      status: failed ? "failed" : "resolved",
      verdict: "ignored",
      resolvedAt: state.minuteOfDay,
    };
    if (feed) nextFeeds[scenarioId] = { ...feed, status: failed ? "failed" : "resolved" };
    const victim = nextVictims[scenario.victim.id];
    if (victim) nextVictims[victim.id] = { ...victim, status: failed ? "scammed" : "safe" };
    trustDelta += failed ? -6 : 2;
    heatDelta += failed ? 5 : 0;
    resolvedDelta += 1;
  });

  return {
    ...state,
    cases: nextCases,
    feeds: nextFeeds,
    victims: nextVictims,
    agencyTrust: clamp(state.agencyTrust + trustDelta, 0, 100),
    networkHeat: clamp(state.networkHeat + heatDelta, 0, 100),
    dayStats: {
      ...state.dayStats,
      casesResolved: state.dayStats.casesResolved + resolvedDelta,
    },
  };
}

function createDailyReport(state: CampaignState) {
  const { dayStats } = state;
  return {
    day: state.day,
    ...dayStats,
    summary: `${dayStats.casesResolved} hồ sơ khép lại, ${dayStats.victimsProtected} nạn nhân được bảo vệ, ${dayStats.falsePositives} báo động nhầm.`,
  };
}

function sleepToNextDay(state: CampaignState): CampaignState {
  if (state.location !== "apartment" || state.phase !== "evening") {
    return {
      ...state,
      notifications: [
        ...state.notifications,
        notification(state, "Hãy kết thúc ca trực trước khi ngủ.", "warning"),
      ],
    };
  }

  const report = createDailyReport(state);
  const reports = [...state.dailyReports, report];
  const restedEnergy = clamp(state.energy + 58, 0, 100);
  const nextHunger = clamp(state.hunger - 12, 0, 100);

  if (state.day >= 3) {
    let ending: CampaignState["endingsUnlocked"][number] = "signal_lost";
    if (!state.rentPaid) ending = "homeless";
    else if (restedEnergy <= 5 || nextHunger <= 5) ending = "burnout";
    else if (state.agencyTrust >= 58 && state.networkHeat <= 65) ending = "syndicate_bust";

    return {
      ...state,
      energy: restedEnergy,
      hunger: nextHunger,
      status: "debrief",
      phase: "ending",
      speed: 0,
      dailyReports: reports,
      endingsUnlocked: state.endingsUnlocked.includes(ending)
        ? state.endingsUnlocked
        : [...state.endingsUnlocked, ending],
    };
  }

  const nextDay = state.day + 1;
  return {
    ...state,
    day: nextDay,
    minuteOfDay: SHIFT_START_MINUTE,
    phase: "morning",
    location: "apartment",
    speed: 0,
    energy: restedEnergy,
    hunger: nextHunger,
    activeSideJob: null,
    dayStats: { ...EMPTY_DAY_STATS },
    dailyReports: reports,
    scheduledEvents: [
      ...state.scheduledEvents,
      ...buildDaySchedule(nextDay, SHIFT_START_MINUTE),
    ],
  };
}

function actionRequirementsMet(
  state: CampaignState,
  caseFile: CaseFileState,
  action: Verdict,
): { valid: boolean; reason: string } {
  const evidence = state.evidence.filter((item) => caseFile.evidenceIds.includes(item.id));
  const entityTypes = new Set(evidence.map((item) => item.entityType));

  if (action === "ignored") return { valid: true, reason: "" };
  if (action === "warned") {
    return evidence.length >= 1
      ? { valid: true, reason: "" }
      : { valid: false, reason: "Cần ít nhất 1 bằng chứng." };
  }
  if (action === "frozen") {
    return evidence.length >= 2 && hasValidGraphLink(state, caseFile.evidenceIds)
      ? { valid: true, reason: "" }
      : { valid: false, reason: "Cần 2 bằng chứng và 1 liên kết đã xác minh." };
  }
  return evidence.length >= 3 && entityTypes.size >= 2
    ? { valid: true, reason: "" }
    : { valid: false, reason: "Cần 3 bằng chứng thuộc ít nhất 2 loại thực thể." };
}

export function campaignReducer(state: CampaignState, action: GameAction): CampaignState {
  switch (action.type) {
    case "START_CAMPAIGN":
      return freshCampaign(action.payload.mode, action.payload.seed ?? `seed_${Date.now()}`);

    case "ENTER_WORKSTATION":
      return {
        ...state,
        location: "workstation",
        speed: state.phase === "shift" ? 1 : state.speed,
      };

    case "START_SHIFT": {
      if (state.location !== "workstation" || state.phase !== "morning") return state;
      return {
        ...state,
        phase: "shift",
        speed: 1,
        shiftStartedDays: state.shiftStartedDays.includes(state.day)
          ? state.shiftStartedDays
          : [...state.shiftStartedDays, state.day],
        notifications: [
          ...state.notifications,
          notification(state, `Ca trực ngày ${state.day} đã bắt đầu.`, "info"),
        ],
      };
    }

    case "END_SHIFT": {
      if (state.phase !== "shift") return state;
      const initialSweepComplete = getDayScenarioIds(state.day).every(
        (scenarioId) => Boolean(state.feeds[scenarioId]),
      );
      if (!initialSweepComplete) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            notification(state, "Chưa thể kết thúc ca trước khi đủ hai tín hiệu đầu ca.", "warning"),
          ],
        };
      }
      const closed = closeOpenCasesForDay(state);
      return {
        ...closed,
        phase: "evening",
        location: "apartment",
        speed: 0,
        notifications: [
          ...closed.notifications,
          notification(closed, "Ca trực đã kết thúc. Hãy cân bằng tiền, thức ăn và giấc ngủ.", "info"),
        ],
      };
    }

    case "RETURN_TO_APARTMENT":
      return { ...state, location: "apartment", speed: 0 };

    case "SET_SPEED":
      if (state.phase !== "shift" || state.status !== "playing") return state;
      return { ...state, speed: action.payload.speed };

    case "TICK": {
      if (state.status !== "playing" || state.phase !== "shift" || state.speed === 0) return state;
      const targetMinute = Math.min(state.minuteOfDay + action.payload.minutes, 23 * 60 + 59);
      const elapsed = Math.max(0, targetMinute - state.minuteOfDay);
      let next: CampaignState = {
        ...state,
        minuteOfDay: targetMinute,
        hunger: clamp(state.hunger - elapsed * 0.08, 0, 100),
        energy: clamp(state.energy - elapsed * 0.07, 0, 100),
      };
      next = processEventsThrough(next, targetMinute);
      if (targetMinute >= 23 * 60 + 59) return { ...closeOpenCasesForDay(next), speed: 0 };
      return next;
    }

    case "PROCESS_EVENT":
      return processEvent(state, action.payload.event);

    case "EXTRACT_EVIDENCE": {
      if (state.evidence.some((item) => item.id === action.payload.token.id)) return state;
      const scenario = SCENARIOS[action.payload.token.feedId];
      const template = scenario?.evidenceBase[action.payload.token.id];
      const caseFile = state.cases[action.payload.token.feedId];
      const feed = state.feeds[action.payload.token.feedId];
      const observedInFeed = feed?.messages.some(
        (message) =>
          message.id === action.payload.token.eventId &&
          message.clues.includes(action.payload.token.id),
      );
      if (!scenario || !template || !caseFile || !observedInFeed) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            notification(state, "Bằng chứng không thuộc ground truth của hồ sơ.", "error"),
          ],
        };
      }

      const token: EvidenceToken = {
        ...action.payload.token,
        caseId: caseFile.id,
        label: template.label,
        value: template.displayValue,
        entityType: template.entityType,
        lookupResult: template.lookupResult,
        relatedEntityIds: [...template.relatedEntityIds],
        educationalNote: template.educationalNote,
        lookedUp: false,
      };
      return {
        ...state,
        evidence: [...state.evidence, token],
        cases: {
          ...state.cases,
          [caseFile.id]: {
            ...caseFile,
            evidenceIds: [...caseFile.evidenceIds, token.id],
          },
        },
        notifications: [
          ...state.notifications,
          notification(state, `Đã niêm phong: ${token.label}`, "success"),
        ],
      };
    }

    case "RUN_OSINT": {
      if (state.internetPaidThroughDay < state.day) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            notification(state, "Internet đã hết hạn. Hãy thanh toán tại router.", "error"),
          ],
        };
      }
      const evidence = state.evidence.find((item) => item.id === action.payload.evidenceId);
      if (!evidence || !evidence.lookupResult) return state;
      const targetMinute = Math.min(state.minuteOfDay + 2, 23 * 60 + 59);
      const next = {
        ...state,
        evidence: state.evidence.map((item) =>
          item.id === evidence.id ? { ...item, lookedUp: true } : item,
        ),
        minuteOfDay: targetMinute,
        energy: clamp(state.energy - 1, 0, 100),
        notifications: [
          ...state.notifications,
          notification(state, `OSINT hoàn tất: ${evidence.label}`, "success"),
        ],
      };
      return state.phase === "shift" ? processEventsThrough(next, targetMinute) : next;
    }

    case "LINK_EVIDENCE": {
      const source = state.evidence.find((item) => item.id === action.payload.sourceId);
      const target = state.evidence.find((item) => item.id === action.payload.targetId);
      if (!source || !target || source.id === target.id || !source.lookedUp || !target.lookedUp) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            notification(state, "Cần tra cứu cả hai bằng chứng trước khi liên kết.", "warning"),
          ],
        };
      }
      const related =
        source.relatedEntityIds.includes(target.id) || target.relatedEntityIds.includes(source.id);
      if (!related) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            notification(state, "Không tìm thấy quan hệ kỹ thuật đáng tin cậy giữa hai node.", "error"),
          ],
        };
      }
      const [first, second] = [source.id, target.id].sort();
      const edgeId = `${first}__${second}`;
      if (state.graphEdges.some((edge) => edge.id === edgeId)) return state;
      return {
        ...state,
        graphEdges: [
          ...state.graphEdges,
          { id: edgeId, sourceId: first ?? source.id, targetId: second ?? target.id, label: "Đã xác minh" },
        ],
        networkHeat: clamp(state.networkHeat - 2, 0, 100),
        notifications: [
          ...state.notifications,
          notification(state, `Đã nối ${source.label} ↔ ${target.label}.`, "success"),
        ],
      };
    }

    case "OPERATIONAL_ACTION": {
      const caseFile = state.cases[action.payload.caseId];
      const scenario = SCENARIOS[action.payload.caseId];
      if (!caseFile || !scenario || caseFile.status !== "open") return state;

      const requirement = actionRequirementsMet(state, caseFile, action.payload.action);
      if (!requirement.valid) {
        return {
          ...state,
          notifications: [
            ...state.notifications,
            notification(state, requirement.reason, "error"),
          ],
        };
      }

      const correct = scenario.isScam
        ? action.payload.action !== "ignored"
        : action.payload.action === "ignored";
      const rewards: Record<Verdict, number> = {
        warned: 25,
        frozen: 40,
        escalated: 60,
        ignored: 10,
      };
      const trustRewards: Record<Verdict, number> = {
        warned: 4,
        frozen: 7,
        escalated: 12,
        ignored: 5,
      };
      const creditDelta = correct ? rewards[action.payload.action] : -20;
      const trustDelta = correct ? trustRewards[action.payload.action] : -15;
      const victim = state.victims[scenario.victim.id];
      const protectedVictim = correct && scenario.isScam;
      const falsePositive = !correct && !scenario.isScam;
      const feed = state.feeds[caseFile.id];
      const nextStatus: CaseFileState["status"] = correct ? "resolved" : "failed";

      const next: CampaignState = {
        ...state,
        credits: Math.max(0, state.credits + creditDelta),
        agencyTrust: clamp(state.agencyTrust + trustDelta, 0, 100),
        networkHeat: clamp(
          state.networkHeat + (correct ? (action.payload.action === "escalated" ? -12 : -4) : 9),
          0,
          100,
        ),
        cases: {
          ...state.cases,
          [caseFile.id]: {
            ...caseFile,
            status: nextStatus,
            verdict: action.payload.action,
            resolvedAt: state.minuteOfDay,
          },
        },
        feeds: feed
          ? {
              ...state.feeds,
              [feed.id]: { ...feed, status: correct ? "resolved" : "failed" },
            }
          : state.feeds,
        victims: victim
          ? {
              ...state.victims,
              [victim.id]: {
                ...victim,
                status: protectedVictim || (!scenario.isScam && correct) ? "safe" : "scammed",
              },
            }
          : state.victims,
        dayStats: {
          ...state.dayStats,
          salaryEarned: state.dayStats.salaryEarned + Math.max(0, creditDelta),
          casesResolved: state.dayStats.casesResolved + 1,
          falsePositives: state.dayStats.falsePositives + (falsePositive ? 1 : 0),
          victimsProtected: state.dayStats.victimsProtected + (protectedVictim ? 1 : 0),
        },
        notifications: [
          ...state.notifications,
          notification(
            state,
            correct
              ? `Quyết định chính xác: ${scenario.title} (${creditDelta >= 0 ? "+" : ""}${creditDelta} CR).`
              : `Quyết định sai: ${scenario.title} (${creditDelta} CR).`,
            correct ? "success" : "error",
          ),
        ],
      };

      if (state.mode === "demo") {
        return { ...next, status: "debrief", phase: "ending", speed: 0 };
      }
      return next;
    }

    case "EAT": {
      const index = state.inventory.findIndex((item) => item.id === action.payload.itemId);
      if (index < 0) return state;
      const item = state.inventory[index];
      if (!item) return state;
      return {
        ...state,
        inventory: state.inventory.filter((_, itemIndex) => itemIndex !== index),
        hunger: clamp(state.hunger + item.effectValue, 0, 100),
      };
    }

    case "BUY_ITEM":
      if (state.credits < action.payload.cost) return state;
      return {
        ...state,
        credits: state.credits - action.payload.cost,
        inventory: [...state.inventory, action.payload.item],
        dayStats: {
          ...state.dayStats,
          expenses: state.dayStats.expenses + action.payload.cost,
        },
      };

    case "PAY_RENT":
      if (state.rentPaid || state.credits < state.rentAmount) return state;
      return {
        ...state,
        credits: state.credits - state.rentAmount,
        rentPaid: true,
        dayStats: {
          ...state.dayStats,
          expenses: state.dayStats.expenses + state.rentAmount,
        },
        notifications: [
          ...state.notifications,
          notification(state, "Đã thanh toán tiền nhà.", "success"),
        ],
      };

    case "PAY_INTERNET":
      if (state.internetPaidThroughDay >= state.day || state.credits < 12) return state;
      return {
        ...state,
        credits: state.credits - 12,
        internetPaidThroughDay: state.day,
        dayStats: { ...state.dayStats, expenses: state.dayStats.expenses + 12 },
        notifications: [
          ...state.notifications,
          notification(state, "Internet đã được gia hạn cho ca hôm nay.", "success"),
        ],
      };

    case "START_JOB":
      if (
        state.activeSideJob ||
        state.completedSideJobDays.includes(state.day) ||
        state.energy < action.payload.job.energyCost
      ) {
        return state;
      }
      return { ...state, activeSideJob: { ...action.payload.job } };

    case "WORK_JOB": {
      const job = state.activeSideJob;
      if (!job || state.completedSideJobDays.includes(state.day)) return state;
      const progress = clamp(job.progress + action.payload.progress, 0, job.maxProgress);
      const fraction = action.payload.progress / job.maxProgress;
      const energy = clamp(state.energy - job.energyCost * fraction, 0, 100);
      const minuteOfDay = Math.min(
        state.minuteOfDay + Math.round(job.timeCost * fraction),
        23 * 60 + 59,
      );
      if (progress < job.maxProgress) {
        return { ...state, energy, minuteOfDay, activeSideJob: { ...job, progress } };
      }
      return {
        ...state,
        energy,
        minuteOfDay,
        credits: state.credits + job.reward,
        activeSideJob: null,
        completedSideJobDays: [...state.completedSideJobDays, state.day],
        dayStats: {
          ...state.dayStats,
          salaryEarned: state.dayStats.salaryEarned + job.reward,
        },
        notifications: [
          ...state.notifications,
          notification(state, `Hoàn thành ${job.name}: +${job.reward} CR.`, "success"),
        ],
      };
    }

    case "SLEEP":
      return sleepToNextDay(state);
  }
}

export { DAY_SCENARIOS };
