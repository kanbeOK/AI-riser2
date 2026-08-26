import { AlertTriangle, CheckCircle2, FileWarning, ShieldAlert } from "lucide-react";
import { SCENARIOS } from "../../game/content/scenarios";
import type { CampaignState, GameAction, Verdict } from "../../game/state/types";

type CaseViewProps = {
  state: CampaignState;
  dispatch: React.Dispatch<GameAction>;
  caseId: string | null;
};

export function CaseView({ state, dispatch, caseId }: CaseViewProps) {
  if (!caseId) return <div className="tool-empty-state">Chưa chọn hồ sơ.</div>;
  const caseFile = state.cases[caseId];
  const scenario = SCENARIOS[caseId];
  if (!caseFile || !scenario) return <div className="tool-empty-state">Không tìm thấy hồ sơ.</div>;

  const evidence = state.evidence.filter((item) => caseFile.evidenceIds.includes(item.id));
  const entityTypeCount = new Set(evidence.map((item) => item.entityType)).size;
  const hasLink = state.graphEdges.some(
    (edge) => caseFile.evidenceIds.includes(edge.sourceId) && caseFile.evidenceIds.includes(edge.targetId),
  );

  const decide = (verdict: Verdict) => {
    dispatch({ type: "OPERATIONAL_ACTION", payload: { caseId, action: verdict } });
  };

  return (
    <div className="case-view">
      <header className="tool-header case-tool-header">
        <div>
          <span>HỒ SƠ / {caseFile.id}</span>
          <h2>{caseFile.title}</h2>
          <p>{scenario.brief}</p>
        </div>
        <div className={`case-state case-state-${caseFile.status}`}>{caseFile.status.toUpperCase()}</div>
      </header>

      <div className="case-content">
        <section className="case-evidence-column">
          <div className="subheading">
            <span>01</span>
            <h3>Chuỗi bằng chứng</h3>
          </div>
          {evidence.length === 0 ? (
            <div className="tool-empty-state compact">Chưa có bằng chứng được niêm phong từ tín hiệu.</div>
          ) : (
            <div className="case-evidence-list">
              {evidence.map((item) => (
                <article key={item.id}>
                  <div className="evidence-index">{item.entityType}</div>
                  <div>
                    <strong>{item.label}</strong>
                    <p>{item.value}</p>
                    <small className={item.lookedUp ? "verified" : "pending"}>
                      {item.lookedUp ? "Đã đối chiếu OSINT" : "Chưa đối chiếu OSINT"}
                    </small>
                  </div>
                </article>
              ))}
            </div>
          )}
          <div className="learning-note">
            <CheckCircle2 size={17} />
            <p><strong>Điểm học:</strong> {scenario.learningObjective}</p>
          </div>
        </section>

        <section className="intervention-column">
          <div className="subheading">
            <span>02</span>
            <h3>Quyết định can thiệp</h3>
          </div>

          {caseFile.status !== "open" ? (
            <div className={`decision-result decision-${caseFile.status}`}>
              {caseFile.status === "resolved" ? <CheckCircle2 /> : <AlertTriangle />}
              <div>
                <strong>Hồ sơ đã khép</strong>
                <p>Quyết định: {caseFile.verdict?.toUpperCase() ?? "KHÔNG CÓ"}</p>
              </div>
            </div>
          ) : (
            <div className="decision-list">
              <article>
                <div className="decision-copy">
                  <span className="decision-level neutral">MỨC 0</span>
                  <strong>Bỏ qua tín hiệu</strong>
                  <p>Dùng khi dữ kiện cho thấy đây là hoạt động hợp pháp.</p>
                </div>
                <button onClick={() => decide("ignored")}>Xác nhận hợp pháp</button>
              </article>

              <article>
                <div className="decision-copy">
                  <span className="decision-level caution">MỨC 1</span>
                  <strong>Cảnh báo nạn nhân</strong>
                  <p>Cần 1 bằng chứng · Hiện có {evidence.length}/1</p>
                </div>
                <button disabled={evidence.length < 1} onClick={() => decide("warned")}>
                  <FileWarning size={15} /> Cảnh báo nạn nhân
                </button>
              </article>

              <article>
                <div className="decision-copy">
                  <span className="decision-level danger">MỨC 2</span>
                  <strong>Đóng băng tài khoản</strong>
                  <p>2 bằng chứng + 1 liên kết · {evidence.length}/2 · {hasLink ? "đã nối" : "chưa nối"}</p>
                </div>
                <button disabled={evidence.length < 2 || !hasLink} onClick={() => decide("frozen")}>
                  Đóng băng mục tiêu
                </button>
              </article>

              <article>
                <div className="decision-copy">
                  <span className="decision-level critical">MỨC 3</span>
                  <strong>Chuyển hồ sơ triệt phá</strong>
                  <p>3 bằng chứng + 2 loại · {evidence.length}/3 · {entityTypeCount}/2 loại</p>
                </div>
                <button
                  disabled={evidence.length < 3 || entityTypeCount < 2}
                  onClick={() => decide("escalated")}
                >
                  <ShieldAlert size={15} /> Chuyển cơ quan chức năng
                </button>
              </article>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
