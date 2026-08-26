import { useEffect, useState } from "react";
import { Database, RadioTower, SearchCheck, WifiOff } from "lucide-react";
import type { CampaignState, GameAction } from "../../game/state/types";

type OsintViewProps = {
  state: CampaignState;
  dispatch: React.Dispatch<GameAction>;
};

export function OsintView({ state, dispatch }: OsintViewProps) {
  const [selectedId, setSelectedId] = useState<string | null>(state.evidence[0]?.id ?? null);
  const selected = state.evidence.find((item) => item.id === selectedId) ?? null;
  const internetAvailable = state.internetPaidThroughDay >= state.day;

  useEffect(() => {
    if (!selectedId && state.evidence[0]) setSelectedId(state.evidence[0].id);
  }, [selectedId, state.evidence]);

  return (
    <div className="osint-view">
      <header className="tool-header">
        <div>
          <span>CÔNG CỤ / OSINT-LOCAL</span>
          <h2>Đối chiếu nguồn mở</h2>
          <p>Mỗi truy vấn tốn 2 phút game. Chọn bằng chứng đã niêm phong, không nhập lại dữ liệu.</p>
        </div>
        <div className={`connection-state ${internetAvailable ? "online" : "offline"}`}>
          {internetAvailable ? <RadioTower size={16} /> : <WifiOff size={16} />}
          {internetAvailable ? "ONLINE" : "MẤT KẾT NỐI"}
        </div>
      </header>

      <div className="osint-body">
        <aside className="osint-source-list">
          <span>NGUỒN ĐÃ NIÊM PHONG / {state.evidence.length}</span>
          {state.evidence.length === 0 ? (
            <div className="tool-empty-state compact">Quay lại tín hiệu và niêm phong ít nhất một attachment.</div>
          ) : (
            state.evidence.map((item) => (
              <button
                key={item.id}
                className={selectedId === item.id ? "selected" : ""}
                onClick={() => setSelectedId(item.id)}
              >
                <Database size={15} />
                <div>
                  <strong>{item.label}</strong>
                  <small>{item.entityType} · {item.lookedUp ? "đã tra" : "chưa tra"}</small>
                </div>
              </button>
            ))
          )}
        </aside>

        <section className="osint-result-pane">
          {!selected ? (
            <div className="tool-empty-state">
              <SearchCheck size={28} />
              <p>Chọn một bằng chứng để bắt đầu.</p>
            </div>
          ) : (
            <>
              <div className="query-specimen">
                <span>{selected.entityType}</span>
                <h3>{selected.label}</h3>
                <code>{selected.value}</code>
              </div>

              {selected.lookedUp ? (
                <div className="lookup-result">
                  <span>KẾT QUẢ ĐÃ KÝ / ML-OSINT</span>
                  <p>{selected.lookupResult}</p>
                  <div className="education-line">{selected.educationalNote}</div>
                  {selected.relatedEntityIds.length > 0 && (
                    <small>Gợi ý quan hệ: {selected.relatedEntityIds.length} node kỹ thuật.</small>
                  )}
                </div>
              ) : (
                <div className="lookup-pending">
                  <p>Dữ liệu chưa được đối chiếu. Chạy truy vấn để mở khóa kết quả và khả năng tạo liên kết.</p>
                  <button
                    disabled={!internetAvailable || !selected.lookupResult}
                    onClick={() => dispatch({ type: "RUN_OSINT", payload: { evidenceId: selected.id } })}
                    aria-label={`Tra cứu ${selected.label}`}
                  >
                    <SearchCheck size={16} /> Chạy đối chiếu
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
}
