import { describe, expect, it } from "vitest";
import { SCENARIOS, getDayScenarioIds } from "../src/game/content/scenarios";
import {
  campaignReducer,
  INITIAL_STATE,
  SHIFT_START_MINUTE,
} from "../src/game/state/reducer";
import type { CampaignState, EvidenceToken, SideJobState } from "../src/game/state/types";

function start(mode: "solo" | "demo" = "solo"): CampaignState {
  return campaignReducer(INITIAL_STATE, {
    type: "START_CAMPAIGN",
    payload: { mode, seed: "test-seed" },
  });
}

function enterAndStartShift(state: CampaignState): CampaignState {
  const atDesk = campaignReducer(state, { type: "ENTER_WORKSTATION" });
  return campaignReducer(atDesk, { type: "START_SHIFT" });
}

function revealDayFeeds(state: CampaignState): CampaignState {
  return campaignReducer(state, { type: "TICK", payload: { minutes: 4 } });
}

function extractObserved(
  state: CampaignState,
  scenarioId: string,
  evidenceId: string,
): CampaignState {
  const scenario = SCENARIOS[scenarioId];
  const template = scenario?.evidenceBase[evidenceId];
  const message = state.feeds[scenarioId]?.messages.find((item) => item.clues.includes(evidenceId));
  if (!scenario || !template || !message) {
    throw new Error(`Evidence ${evidenceId} has not been observed in ${scenarioId}`);
  }
  const token: EvidenceToken = {
    id: template.id,
    caseId: scenarioId,
    feedId: scenarioId,
    eventId: message.id,
    entityType: template.entityType,
    label: template.label,
    value: template.displayValue,
    observedAt: state.minuteOfDay,
    confidence: 100,
    sourceRef: `${scenarioId}/${message.id}`,
    lookupResult: template.lookupResult,
    relatedEntityIds: [...template.relatedEntityIds],
    educationalNote: template.educationalNote,
    lookedUp: false,
  };
  return campaignReducer(state, { type: "EXTRACT_EVIDENCE", payload: { token } });
}

function finishDay(state: CampaignState): CampaignState {
  const withFeeds = revealDayFeeds(state);
  const ended = campaignReducer(withFeeds, { type: "END_SHIFT" });
  return campaignReducer(ended, { type: "SLEEP" });
}

describe("campaign scheduler and runtime", () => {
  it("starts demo with two feeds and their first messages immediately", () => {
    const state = start("demo");
    expect(state.mode).toBe("demo");
    expect(state.phase).toBe("shift");
    expect(state.speed).toBe(1);
    expect(Object.keys(state.feeds)).toEqual(
      expect.arrayContaining(["c1_qr_delivery", "c2_legit_shipper"]),
    );
    expect(state.feeds.c1_qr_delivery?.messages.length).toBeGreaterThan(0);
    expect(state.feeds.c2_legit_shipper?.messages.length).toBeGreaterThan(0);
  });

  it("starts solo only after the player enters the desk and starts the shift", () => {
    const initial = start("solo");
    expect(initial.location).toBe("apartment");
    expect(initial.speed).toBe(0);
    expect(Object.keys(initial.feeds)).toHaveLength(0);

    const active = enterAndStartShift(initial);
    expect(active.location).toBe("workstation");
    expect(active.phase).toBe("shift");
    expect(active.speed).toBe(1);

    const afterFirstMinute = campaignReducer(active, { type: "TICK", payload: { minutes: 1 } });
    expect(afterFirstMinute.feeds.c1_qr_delivery).toBeDefined();
    expect(afterFirstMinute.minuteOfDay).toBe(SHIFT_START_MINUTE + 1);
  });

  it("can pause and resume without soft-locking time", () => {
    let state = enterAndStartShift(start("solo"));
    state = campaignReducer(state, { type: "SET_SPEED", payload: { speed: 0 } });
    const pausedMinute = state.minuteOfDay;
    state = campaignReducer(state, { type: "TICK", payload: { minutes: 5 } });
    expect(state.minuteOfDay).toBe(pausedMinute);
    state = campaignReducer(state, { type: "SET_SPEED", payload: { speed: 1 } });
    state = campaignReducer(state, { type: "TICK", payload: { minutes: 1 } });
    expect(state.minuteOfDay).toBe(pausedMinute + 1);
  });

  it("schedules the correct pair of scenarios on all three days", () => {
    let state = enterAndStartShift(start("solo"));
    expect(getDayScenarioIds(1)).toEqual(["c1_qr_delivery", "c2_legit_shipper"]);
    state = finishDay(state);
    expect(state.day).toBe(2);
    expect(state.scheduledEvents.some((event) => event.id.includes("c3_commission_start"))).toBe(true);
    expect(state.scheduledEvents.some((event) => event.id.includes("c4_bank_impersonation_start"))).toBe(true);

    state = enterAndStartShift(state);
    state = finishDay(state);
    expect(state.day).toBe(3);
    expect(state.scheduledEvents.some((event) => event.id.includes("c5_emergency_start"))).toBe(true);
    expect(state.scheduledEvents.some((event) => event.id.includes("c6_school_refund_start"))).toBe(true);
  });

  it("does not process a scheduled event more than once", () => {
    let state = start("demo");
    const futureEvent = state.scheduledEvents.find(
      (event) => event.type === "feed_message" && !state.processedEventIds.includes(event.id),
    );
    if (!futureEvent || futureEvent.type !== "feed_message") throw new Error("Missing future event");
    state = campaignReducer(state, { type: "PROCESS_EVENT", payload: { event: futureEvent } });
    const messageCount = state.feeds[futureEvent.payload.feedId]?.messages.length;
    state = campaignReducer(state, { type: "PROCESS_EVENT", payload: { event: futureEvent } });
    expect(state.feeds[futureEvent.payload.feedId]?.messages.length).toBe(messageCount);
    expect(state.processedEventIds.filter((id) => id === futureEvent.id)).toHaveLength(1);
  });

  it("turns unresolved scams into failures at the deadline", () => {
    let state = enterAndStartShift(start("solo"));
    state = campaignReducer(state, { type: "TICK", payload: { minutes: 20 } });
    expect(state.cases.c1_qr_delivery?.status).toBe("failed");
    expect(state.victims.victim_huong?.status).toBe("scammed");
    expect(state.agencyTrust).toBeLessThan(50);
  });
});

describe("evidence, decisions and economy", () => {
  it("rejects evidence that was never observed in a feed", () => {
    const state = start("demo");
    const fake: EvidenceToken = {
      id: "c1_domain",
      caseId: "c1_qr_delivery",
      feedId: "c1_qr_delivery",
      eventId: "invented-message",
      entityType: "domain",
      label: "Fake",
      value: "fake.test",
      observedAt: state.minuteOfDay,
      confidence: 100,
      sourceRef: "invented",
      lookupResult: "Invented",
      relatedEntityIds: [],
      educationalNote: "Invented",
      lookedUp: false,
    };
    const next = campaignReducer(state, { type: "EXTRACT_EVIDENCE", payload: { token: fake } });
    expect(next.evidence).toHaveLength(0);
    expect(next.notifications.at(-1)?.type).toBe("error");
  });

  it("resolves a demo intervention and enters debrief", () => {
    let state = start("demo");
    state = extractObserved(state, "c1_qr_delivery", "c1_phone");
    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c1_qr_delivery", action: "warned" },
    });
    expect(state.status).toBe("debrief");
    expect(state.speed).toBe(0);
    expect(state.cases.c1_qr_delivery?.status).toBe("resolved");
    expect(state.victims.victim_huong?.status).toBe("safe");
  });

  it("does not reward an empty case or a resolved case twice", () => {
    let state = start("demo");
    const creditsBefore = state.credits;
    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c1_qr_delivery", action: "warned" },
    });
    expect(state.credits).toBe(creditsBefore);

    state = extractObserved(state, "c1_qr_delivery", "c1_phone");
    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c1_qr_delivery", action: "warned" },
    });
    const creditsAfter = state.credits;
    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c1_qr_delivery", action: "warned" },
    });
    expect(state.credits).toBe(creditsAfter);
  });

  it("requires two OSINT-verified, truly related evidence nodes to freeze", () => {
    let state = start("demo");
    state = campaignReducer(state, { type: "TICK", payload: { minutes: 5 } });
    state = extractObserved(state, "c1_qr_delivery", "c1_domain");
    state = extractObserved(state, "c1_qr_delivery", "c1_account");
    const creditsBefore = state.credits;

    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c1_qr_delivery", action: "frozen" },
    });
    expect(state.credits).toBe(creditsBefore);

    state = campaignReducer(state, { type: "RUN_OSINT", payload: { evidenceId: "c1_domain" } });
    state = campaignReducer(state, { type: "RUN_OSINT", payload: { evidenceId: "c1_account" } });
    state = campaignReducer(state, {
      type: "LINK_EVIDENCE",
      payload: { sourceId: "c1_domain", targetId: "c1_account" },
    });
    expect(state.graphEdges).toHaveLength(1);

    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c1_qr_delivery", action: "frozen" },
    });
    expect(state.credits).toBeGreaterThan(creditsBefore);
  });

  it("penalizes a false positive on the legitimate shipper", () => {
    let state = start("demo");
    state = extractObserved(state, "c2_legit_shipper", "c2_order");
    state = campaignReducer(state, {
      type: "OPERATIONAL_ACTION",
      payload: { caseId: "c2_legit_shipper", action: "warned" },
    });
    expect(state.cases.c2_legit_shipper?.status).toBe("failed");
    expect(state.dayStats.falsePositives).toBe(1);
    expect(state.agencyTrust).toBeLessThan(50);
  });

  it("pays a side job only once per day", () => {
    const job: SideJobState = {
      id: "test-job",
      name: "Test job",
      progress: 0,
      maxProgress: 2,
      reward: 28,
      energyCost: 16,
      timeCost: 50,
    };
    let state = start("solo");
    state = campaignReducer(state, { type: "START_JOB", payload: { job } });
    state = campaignReducer(state, { type: "WORK_JOB", payload: { progress: 1 } });
    state = campaignReducer(state, { type: "WORK_JOB", payload: { progress: 1 } });
    const creditsAfter = state.credits;
    expect(state.completedSideJobDays).toContain(1);
    expect(state.activeSideJob).toBeNull();

    state = campaignReducer(state, { type: "START_JOB", payload: { job } });
    state = campaignReducer(state, { type: "WORK_JOB", payload: { progress: 2 } });
    expect(state.credits).toBe(creditsAfter);
  });

  it("reaches a campaign ending after sleeping at the end of day three", () => {
    let state = enterAndStartShift(start("solo"));
    state = finishDay(state);
    state = enterAndStartShift(state);
    state = finishDay(state);
    state = enterAndStartShift(state);
    state = revealDayFeeds(state);
    state = campaignReducer(state, { type: "END_SHIFT" });
    state = { ...state, rentPaid: true };
    state = campaignReducer(state, { type: "SLEEP" });
    expect(state.status).toBe("debrief");
    expect(state.phase).toBe("ending");
    expect(state.dailyReports).toHaveLength(3);
    expect(state.endingsUnlocked.length).toBeGreaterThan(0);
  });
});

describe("scenario content integrity", () => {
  it("ships exactly six typed scenarios with valid clue references", () => {
    expect(Object.keys(SCENARIOS)).toHaveLength(6);
    Object.values(SCENARIOS).forEach((scenario) => {
      expect(scenario.beats.length).toBeGreaterThanOrEqual(3);
      expect(Object.keys(scenario.evidenceBase).length).toBeGreaterThanOrEqual(3);
      scenario.beats.flatMap((beat) => beat.clues).forEach((clueId) => {
        expect(scenario.evidenceBase[clueId]).toBeDefined();
      });
    });
  });
});
