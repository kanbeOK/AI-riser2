import { useMemo, useState } from "react";
import { Link2, Network, Unlink } from "lucide-react";
import type { CampaignState, EvidenceToken, GameAction } from "../../game/state/types";

type GraphViewProps = {
  state: CampaignState;
  dispatch: React.Dispatch<GameAction>;
};

type Point = { x: number; y: number };

function nodePositions(total: number): Point[] {
  if (total === 0) return [];
  return Array.from({ length: total }, (_, index) => {
    if (total === 1) return { x: 50, y: 50 };
    const ring = index < 8 ? 0 : 1;
    const ringIndex = ring === 0 ? index : index - 8;
    const ringTotal = ring === 0 ? Math.min(total, 8) : Math.max(1, total - 8);
    const radiusX = ring === 0 ? 36 : 22;
    const radiusY = ring === 0 ? 34 : 20;
    const angle = (Math.PI * 2 * ringIndex) / ringTotal - Math.PI / 2;
    return { x: 50 + Math.cos(angle) * radiusX, y: 50 + Math.sin(angle) * radiusY };
  });
}

function related(source: EvidenceToken, target: EvidenceToken): boolean {
  return source.relatedEntityIds.includes(target.id) || target.relatedEntityIds.includes(source.id);
}

export function GraphView({ state, dispatch }: GraphViewProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const positions = useMemo(() => nodePositions(state.evidence.length), [state.evidence.length]);
  const evidenceIndex = useMemo(
    () => new Map(state.evidence.map((item, index) => [item.id, index])),
    [state.evidence],
  );
  const selectedEvidence = selectedIds
    .map((id) => state.evidence.find((item) => item.id === id))
    .filter((item): item is EvidenceToken => Boolean(item));
  const canLink =
    selectedEvidence.length === 2 &&
    Boolean(selectedEvidence[0]?.lookedUp) &&
    Boolean(selectedEvidence[1]?.lookedUp) &&
    related(selectedEvidence[0] as EvidenceToken, selectedEvidence[1] as EvidenceToken);

  const toggle = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 2) return [current[1] as string, id];
      return [...current, id];
    });
  };

  const createLink = () => {
    const [sourceId, targetId] = selectedIds;
    if (!sourceId || !targetId || !canLink) return;
    dispatch({ type: "LINK_EVIDENCE", payload: { sourceId, targetId } });
    setSelectedIds([]);
  };

  return (
    <div className="graph-view">
      <header className="tool-header">
        <div>
          <span>CÔNG CỤ / ENTITY-GRAPH</span>
          <h2>Lưới liên kết CÒ XÁM</h2>
          <p>Chỉ node đã tra OSINT và có quan hệ trong ground truth mới được nối.</p>
        </div>
        <div className="graph-score"><Network size={17} /> {state.graphEdges.length} liên kết</div>
      </header>

      <div className="graph-workspace">
        <section className="graph-canvas" aria-label="Đồ thị bằng chứng">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {state.graphEdges.map((edge) => {
              const sourceIndex = evidenceIndex.get(edge.sourceId);
              const targetIndex = evidenceIndex.get(edge.targetId);
              if (sourceIndex === undefined || targetIndex === undefined) return null;
              const source = positions[sourceIndex];
              const target = positions[targetIndex];
              if (!source || !target) return null;
              return (
                <line
                  key={edge.id}
                  x1={source.x}
                  y1={source.y}
                  x2={target.x}
                  y2={target.y}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {state.evidence.map((item, index) => {
            const point = positions[index];
            if (!point) return null;
            const selected = selectedIds.includes(item.id);
            return (
              <button
                key={item.id}
                className={`graph-node ${selected ? "selected" : ""} ${item.lookedUp ? "unlocked" : "locked"}`}
                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                onClick={() => toggle(item.id)}
                aria-label={`Chọn node ${item.label}`}
              >
                <span>{item.entityType}</span>
                <strong>{item.label}</strong>
                <small>{item.lookedUp ? "ĐÃ TRA" : "KHÓA OSINT"}</small>
              </button>
            );
          })}

          {state.evidence.length === 0 && (
            <div className="tool-empty-state graph-empty">
              <Unlink size={30} />
              <p>Chưa có node. Niêm phong bằng chứng từ tín hiệu trước.</p>
            </div>
          )}
        </section>

        <aside className="link-console">
          <span>LIÊN KẾT THỦ CÔNG</span>
          <div className="selected-node-list">
            {[0, 1].map((slot) => {
              const item = selectedEvidence[slot];
              return (
                <div key={slot} className={item ? "filled" : ""}>
                  <small>NODE {slot + 1}</small>
                  <strong>{item?.label ?? "Chưa chọn"}</strong>
                </div>
              );
            })}
          </div>
          <p className={canLink ? "link-valid" : "link-invalid"}>
            {selectedEvidence.length < 2
              ? "Chọn hai node."
              : !selectedEvidence.every((item) => item.lookedUp)
                ? "Tra OSINT cả hai node trước."
                : canLink
                  ? "Quan hệ kỹ thuật hợp lệ."
                  : "Không có quan hệ ground truth."}
          </p>
          <button disabled={!canLink} onClick={createLink}>
            <Link2 size={16} /> Xác minh liên kết
          </button>

          <div className="edge-ledger">
            <span>ĐÃ XÁC MINH</span>
            {state.graphEdges.length === 0 ? (
              <p>Chưa có edge.</p>
            ) : (
              state.graphEdges.map((edge) => (
                <p key={edge.id}>{edge.sourceId} ↔ {edge.targetId}</p>
              ))
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
