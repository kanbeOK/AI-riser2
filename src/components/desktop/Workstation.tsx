import { useEffect, useMemo, useState } from "react";
import { FastForward, LogOut, Pause, Play, Radio, ScanLine } from "lucide-react";
import { getDayScenarioIds, SCENARIOS } from "../../game/content/scenarios";
import type { CampaignState, GameAction, GameSpeed } from "../../game/state/types";
import { EvidenceTray } from "./EvidenceTray";
import { FeedMonitor } from "./FeedMonitor";
import { InvestigationOverlay } from "./InvestigationOverlay";

type WorkstationProps = {
  state: CampaignState;
  dispatch: React.Dispatch<GameAction>;
};

function formatTime(minutes: number): string {
  const hours = Math.floor(minutes / 60).toString().padStart(2, "0");
  const mins = (minutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

export function Workstation({ state, dispatch }: WorkstationProps) {
  const [focusedFeedId, setFocusedFeedId] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<"osint" | "graph" | "case" | null>(null);
  const [focusedCaseId, setFocusedCaseId] = useState<string | null>(null);

  const dayScenarioIds = getDayScenarioIds(state.day);
  const feeds = useMemo(
    () =>
      dayScenarioIds
        .map((scenarioId) => state.feeds[scenarioId])
        .filter((feed): feed is NonNullable<typeof feed> => Boolean(feed)),
    [dayScenarioIds, state.feeds],
  );

  const mainFeed =
    feeds.find((feed) => feed.id === focusedFeedId) ??
    feeds.find((feed) => feed.status === "active") ??
    feeds[0];
  const sideFeeds = feeds.filter((feed) => feed.id !== mainFeed?.id);
  const initialSweepComplete = feeds.length === dayScenarioIds.length;

  useEffect(() => {
    if (!focusedFeedId && feeds[0]) setFocusedFeedId(feeds[0].id);
  }, [feeds, focusedFeedId]);

  const openCase = (caseId: string) => {
    setFocusedCaseId(caseId);
    setActiveOverlay("case");
  };

  if (state.phase === "morning") {
    return (
      <main className="briefing-screen">
        <div className="briefing-noise" aria-hidden="true" />
        <section className="briefing-terminal">
          <header>
            <div>
              <span className="eyebrow">MẮT LƯỚI / LỆNH CA ĐÊM</span>
              <h1>Đêm {state.day}: bắt tín hiệu trước khi nó biến mất</h1>
            </div>
            <div className="briefing-clock">{formatTime(state.minuteOfDay)}</div>
          </header>
          <div className="briefing-body">
            <div className="operator-portrait" aria-hidden="true">
              <Radio />
              <span>AN / ĐIỀU PHỐI</span>
            </div>
            <div className="briefing-copy">
              <p>
                Hai luồng sẽ chạy song song. Tập trung quá lâu vào một cửa sổ có thể khiến luồng còn lại vượt hạn.
                Chỉ can thiệp khi bằng chứng đủ mạnh.
              </p>
              <div className="briefing-targets">
                {dayScenarioIds.map((scenarioId, index) => {
                  const scenario = SCENARIOS[scenarioId];
                  if (!scenario) return null;
                  return (
                    <article key={scenarioId}>
                      <span>0{index + 1}</span>
                      <div>
                        <strong>{scenario.title}</strong>
                        <p>{scenario.brief}</p>
                      </div>
                    </article>
                  );
                })}
              </div>
              <button
                className="primary-cta briefing-start"
                onClick={() => dispatch({ type: "START_SHIFT" })}
              >
                <Play size={18} /> Bắt đầu ca trực
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="workstation-shell">
      <header className="workstation-header">
        <div className="station-identity">
          <ScanLine size={18} />
          <div>
            <strong>MẮT LƯỚI / TRẠM 404</strong>
            <span>ĐÊM {state.day} · {formatTime(state.minuteOfDay)}</span>
          </div>
        </div>

        <div className="resource-strip" aria-label="Tài nguyên chiến dịch">
          <div><span>Uy tín</span><strong>{state.agencyTrust}%</strong></div>
          <div><span>Nhiệt</span><strong>{state.networkHeat}%</strong></div>
          <div><span>Năng lượng</span><strong>{Math.round(state.energy)}%</strong></div>
          <div><span>CR</span><strong>{state.credits}</strong></div>
        </div>

        <div className="time-controls" aria-label="Điều khiển thời gian">
          <button
            aria-label="Tạm dừng thời gian"
            className={state.speed === 0 ? "active" : ""}
            onClick={() => dispatch({ type: "SET_SPEED", payload: { speed: 0 } })}
          >
            <Pause size={15} />
          </button>
          {([1, 2, 4] as GameSpeed[]).map((speed) => (
            <button
              key={speed}
              aria-label={speed === 1 ? "Tiếp tục thời gian" : `Tăng tốc ${speed} lần`}
              className={state.speed === speed ? "active" : ""}
              onClick={() => dispatch({ type: "SET_SPEED", payload: { speed } })}
            >
              {speed === 1 ? <Play size={15} /> : <FastForward size={15} />}
              <span>{speed}×</span>
            </button>
          ))}
        </div>
      </header>

      {state.speed === 0 && (
        <div className="paused-banner" role="status">
          THỜI GIAN ĐANG TẠM DỪNG — BẤM 1× ĐỂ TIẾP TỤC
        </div>
      )}

      <section className="signal-desk">
        <div className="main-monitor">
          <div className="monitor-frame-label">
            <span>FOCUS / {mainFeed?.id ?? "NO SIGNAL"}</span>
            <span className="monitor-rec">REC</span>
          </div>
          {mainFeed ? (
            <FeedMonitor
              feed={mainFeed}
              state={state}
              dispatch={dispatch}
              isMain
              onOpenCase={() => openCase(mainFeed.id)}
            />
          ) : (
            <div className="scanning-state">
              <div className="scan-reticle" aria-hidden="true" />
              <strong>Đang quét băng tần</strong>
              <p>Tín hiệu đầu tiên sẽ xuất hiện sau một phút game.</p>
            </div>
          )}
        </div>

        <aside className="side-monitor-stack">
          <div className="side-stack-heading">
            <span>LUỒNG NỀN</span>
            <strong>{sideFeeds.length.toString().padStart(2, "0")}</strong>
          </div>
          {sideFeeds.map((feed) => (
            <button
              key={feed.id}
              className="side-monitor"
              onClick={() => setFocusedFeedId(feed.id)}
              aria-label={`Tập trung tín hiệu ${feed.title}`}
            >
              <FeedMonitor
                feed={feed}
                state={state}
                dispatch={dispatch}
                isMain={false}
                onOpenCase={() => openCase(feed.id)}
              />
            </button>
          ))}

          <section className="radio-log" aria-label="Bộ đàm điều phối">
            <header><Radio size={15} /> Bộ đàm / AN</header>
            <div>
              {state.notifications.slice(-5).map((item) => (
                <p key={item.id} className={`radio-${item.type}`}>
                  <span>{formatTime(item.time)}</span>{item.message}
                </p>
              ))}
              {state.notifications.length === 0 && <p>Giữ kênh mở. Chờ tín hiệu.</p>}
            </div>
          </section>
        </aside>
      </section>

      <EvidenceTray
        state={state}
        onOpenTool={(tool) => setActiveOverlay(tool)}
      />

      <footer className="shift-footer">
        <button onClick={() => dispatch({ type: "RETURN_TO_APARTMENT" })}>
          <LogOut size={15} /> Tạm rời bàn
        </button>
        <div>
          <span>{Object.values(state.cases).filter((item) => item.day === state.day && item.status !== "open").length}/{dayScenarioIds.length} hồ sơ đã khép</span>
          <button
            className="end-shift-button"
            disabled={!initialSweepComplete}
            onClick={() => dispatch({ type: "END_SHIFT" })}
            title={initialSweepComplete ? "Khép các hồ sơ còn mở và về căn hộ" : "Chờ đủ hai tín hiệu đầu ca"}
          >
            {initialSweepComplete ? "Kết thúc ca" : "Đang quét đầu ca"}
          </button>
        </div>
      </footer>

      {activeOverlay && (
        <div className="investigation-backdrop" role="dialog" aria-modal="true">
          <section className="investigation-window">
            <button
              className="overlay-close"
              onClick={() => setActiveOverlay(null)}
              aria-label="Đóng công cụ điều tra"
            >
              ×
            </button>
            <InvestigationOverlay
              type={activeOverlay}
              state={state}
              dispatch={dispatch}
              focusedCaseId={focusedCaseId}
            />
          </section>
        </div>
      )}
    </main>
  );
}
