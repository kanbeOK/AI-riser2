import { Database, Network, SearchCheck } from "lucide-react";
import type { CampaignState } from "../../game/state/types";

type EvidenceTrayProps = {
  state: CampaignState;
  onOpenTool: (tool: "osint" | "graph") => void;
};

export function EvidenceTray({ state, onOpenTool }: EvidenceTrayProps) {
  return (
    <section className="evidence-tray" aria-label="Dải bằng chứng">
      <div className="evidence-tools">
        <span>DỤNG CỤ</span>
        <button onClick={() => onOpenTool("osint")}>
          <Database size={15} /> OSINT
        </button>
        <button onClick={() => onOpenTool("graph")}>
          <Network size={15} /> Lưới liên kết
        </button>
      </div>
      <div className="evidence-strip">
        {state.evidence.length === 0 ? (
          <div className="empty-evidence">
            <SearchCheck size={19} />
            <span>Chưa niêm phong bằng chứng. Mở attachment trong luồng tín hiệu.</span>
          </div>
        ) : (
          state.evidence.map((evidence, index) => (
            <article
              key={evidence.id}
              className={`evidence-slip ${evidence.lookedUp ? "evidence-verified" : ""}`}
              style={{ transform: `rotate(${index % 2 === 0 ? -0.8 : 0.7}deg)` }}
            >
              <header>
                <span>{evidence.entityType}</span>
                <strong>{evidence.lookedUp ? "OSINT ✓" : "CHƯA TRA"}</strong>
              </header>
              <p>{evidence.label}</p>
              <small>{evidence.value}</small>
            </article>
          ))
        )}
      </div>
    </section>
  );
}
