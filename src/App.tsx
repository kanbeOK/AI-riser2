import { useEffect, useReducer } from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router";
import { Apartment } from "./components/apartment/Apartment";
import { Workstation } from "./components/desktop/Workstation";
import { SCENARIOS } from "./game/content/scenarios";
import { campaignReducer, INITIAL_STATE } from "./game/state/reducer";
import type { CampaignState } from "./game/state/types";

function IntroScreen() {
  return (
    <main className="intro-screen">
      <div className="intro-grid" aria-hidden="true" />
      <div className="intro-signal intro-signal-a" aria-hidden="true" />
      <div className="intro-signal intro-signal-b" aria-hidden="true" />

      <section className="intro-copy">
        <div className="eyebrow">PHANH! / AI RISER VIETNAM</div>
        <h1>
          MẮT LƯỚI
          <span>CA TRỰC 03</span>
        </h1>
        <p className="intro-lead">
          Sáu tín hiệu. Ba đêm. Một mạng lưới lừa đảo đang đổi hạ tầng trước bình minh.
        </p>
        <div className="intro-actions">
          <Link className="primary-cta" to="/game?mode=solo">
            Bắt đầu chiến dịch
          </Link>
          <Link className="secondary-cta" to="/game?mode=demo">
            Demo 90 giây
          </Link>
        </div>
        <p className="safety-note">
          Mô phỏng giáo dục — toàn bộ danh tính, domain và giao dịch đều là dữ liệu hư cấu.
        </p>
      </section>

      <aside className="intro-dossier" aria-label="Tóm tắt nhiệm vụ">
        <div className="dossier-stamp">MẬT / ML-03</div>
        <div className="dossier-row">
          <span>Mục tiêu</span>
          <strong>CÒ XÁM</strong>
        </div>
        <div className="dossier-row">
          <span>Vai trò</span>
          <strong>Điều tra viên từ xa</strong>
        </div>
        <div className="dossier-row">
          <span>Ràng buộc</span>
          <strong>Tiền nhà / Năng lượng / Uy tín</strong>
        </div>
        <div className="signal-preview" aria-hidden="true">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </aside>
    </main>
  );
}

function endingCopy(state: CampaignState): { title: string; text: string } {
  if (state.mode === "demo") {
    return {
      title: "Demo hoàn tất",
      text: "Bạn đã biến một tín hiệu rời rạc thành quyết định có căn cứ.",
    };
  }
  if (state.endingsUnlocked.includes("syndicate_bust")) {
    return {
      title: "Mạng lưới bị bóc gỡ",
      text: "Các node cuối cùng đã khép thành một hồ sơ đủ mạnh để chuyển giao CÒ XÁM.",
    };
  }
  if (state.endingsUnlocked.includes("homeless")) {
    return {
      title: "Một chiến thắng quá đắt",
      text: "Ca trực kết thúc, nhưng tiền nhà chưa được thanh toán. Công việc và đời sống không thể tách rời.",
    };
  }
  if (state.endingsUnlocked.includes("burnout")) {
    return {
      title: "Tín hiệu tắt vì kiệt sức",
      text: "Không một điều tra viên nào có thể bảo vệ người khác nếu bản thân không còn sức tiếp tục.",
    };
  }
  return {
    title: "Tín hiệu đã mất",
    text: "CÒ XÁM rút khỏi hạ tầng trước khi chuỗi bằng chứng đủ chặt. Một số bài học vẫn còn được giữ lại.",
  };
}

function DebriefScreen({ state }: { state: CampaignState }) {
  const ending = endingCopy(state);
  const resolvedCases = Object.values(state.cases).filter((caseFile) => caseFile.verdict);

  return (
    <main className="debrief-screen">
      <header className="debrief-hero">
        <div className="eyebrow">BÁO CÁO SAU CA / {state.mode === "demo" ? "MÔ PHỎNG" : "CHIẾN DỊCH"}</div>
        <h1>{ending.title}</h1>
        <p>{ending.text}</p>
        <div className="debrief-metrics">
          <div><span>Uy tín</span><strong>{state.agencyTrust}%</strong></div>
          <div><span>Nhiệt mạng</span><strong>{state.networkHeat}%</strong></div>
          <div><span>Bằng chứng</span><strong>{state.evidence.length}</strong></div>
          <div><span>Tín dụng</span><strong>{state.credits} CR</strong></div>
        </div>
      </header>

      <section className="debrief-ledger">
        <div className="section-heading">
          <span>01</span>
          <h2>Dòng quyết định</h2>
        </div>
        {resolvedCases.length === 0 ? (
          <p className="empty-copy">Không có hồ sơ nào được xử lý trong lượt này.</p>
        ) : (
          <div className="debrief-case-list">
            {resolvedCases.map((caseFile) => {
              const scenario = SCENARIOS[caseFile.id];
              return (
                <article key={caseFile.id} className="debrief-case">
                  <div>
                    <span className="case-code">{caseFile.id}</span>
                    <h3>{caseFile.title}</h3>
                    <p>{scenario?.learningObjective}</p>
                  </div>
                  <div className={`verdict verdict-${caseFile.status}`}>
                    {caseFile.verdict === "ignored" ? "BỎ QUA" : caseFile.verdict?.toUpperCase()}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {state.dailyReports.length > 0 && (
        <section className="debrief-ledger">
          <div className="section-heading">
            <span>02</span>
            <h2>Nhật ký ba đêm</h2>
          </div>
          <div className="report-grid">
            {state.dailyReports.map((report) => (
              <article key={report.day} className="report-card">
                <span>Đêm {report.day}</span>
                <strong>{report.victimsProtected} người được bảo vệ</strong>
                <p>{report.summary}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      <Link className="primary-cta debrief-return" to="/">
        Trở về đầu ca
      </Link>
    </main>
  );
}

export function GameRoot() {
  const [state, dispatch] = useReducer(campaignReducer, INITIAL_STATE);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch({
      type: "START_CAMPAIGN",
      payload: { mode: params.get("mode") === "demo" ? "demo" : "solo" },
    });
  }, []);

  useEffect(() => {
    if (state.status !== "playing" || state.phase !== "shift" || state.speed === 0) return;
    const interval = window.setInterval(() => {
      dispatch({ type: "TICK", payload: { minutes: 1 } });
    }, 1000 / state.speed);
    return () => window.clearInterval(interval);
  }, [state.phase, state.speed, state.status]);

  useEffect(() => {
    const pauseOnBlur = () => {
      if (state.status === "playing" && state.phase === "shift" && state.speed > 0) {
        dispatch({ type: "SET_SPEED", payload: { speed: 0 } });
      }
    };
    window.addEventListener("blur", pauseOnBlur);
    return () => window.removeEventListener("blur", pauseOnBlur);
  }, [state.phase, state.speed, state.status]);

  if (state.status === "debrief") return <DebriefScreen state={state} />;
  if (state.location === "apartment") return <Apartment state={state} dispatch={dispatch} />;
  return <Workstation state={state} dispatch={dispatch} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/game" element={<GameRoot />} />
      </Routes>
    </BrowserRouter>
  );
}
