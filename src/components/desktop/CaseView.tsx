import React from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

export function CaseView({ state, dispatch, caseId }: { state: CampaignState, dispatch: React.Dispatch<GameAction>, caseId: string | null }) {
  if (!caseId) return <div className="p-8 text-center text-[#86949B]">Chưa chọn hồ sơ</div>;
  const c = state.cases[caseId];
  if (!c) return <div className="p-8 text-center text-[#86949B]">Không tìm thấy hồ sơ</div>;

  const caseEvidence = state.evidence.filter(e => c.evidenceIds.includes(e.id));
  const entityTypes = new Set(caseEvidence.map(e => e.entityType));
  const hasLink = state.graphEdges.some(edge => c.evidenceIds.includes(edge.sourceId) || c.evidenceIds.includes(edge.targetId));

  const handleAction = (action: 'warned' | 'frozen' | 'banned' | 'escalated' | 'ignored') => {
     dispatch({ type: 'OPERATIONAL_ACTION', payload: { caseId, action } });
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 font-mono flex flex-col gap-8">
       <div className="border-b border-[#2A363D] pb-4">
          <h2 className="text-2xl font-bold text-[#EDF2EE] uppercase tracking-widest">{c.title}</h2>
          <div className="text-sm text-[#86949B]">MÃ HỒ SƠ: {c.id} | TRẠNG THÁI: <span className={c.status === 'open' ? 'text-[#E7A64A]' : 'text-[#63E6C5]'}>{c.status.toUpperCase()}</span></div>
       </div>

       <div>
          <h3 className="text-[#63E6C5] font-bold uppercase tracking-widest mb-4">Bằng chứng thu thập ({caseEvidence.length})</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {caseEvidence.map(ev => (
                <div key={ev.id} className="border border-[#2A363D] bg-[#172127] p-4 rounded flex flex-col gap-2">
                   <div className="text-[10px] text-[#E7A64A] font-bold uppercase">{ev.entityType}</div>
                   <div className="text-sm text-[#EDF2EE]">{ev.displayValue || ev.value}</div>
                   {ev.lookupResult && (
                      <div className="text-xs text-[#86949B] bg-[#07090C] p-2 rounded mt-2 border border-[#2A363D]">
                         {ev.lookupResult}
                      </div>
                   )}
                </div>
             ))}
             {caseEvidence.length === 0 && <div className="text-[#86949B] italic text-sm">Chưa có bằng chứng nào được ghim vào hồ sơ này.</div>}
          </div>
       </div>

       {c.status === 'open' && (
          <div>
             <h3 className="text-[#FF5B5B] font-bold uppercase tracking-widest mb-4">Can thiệp & Quyết định</h3>
             <div className="flex flex-col gap-4">
                
                {/* Action 1: Bỏ qua */}
                <div className="border border-[#2A363D] p-4 flex justify-between items-center rounded bg-[#172127]">
                   <div>
                      <div className="font-bold text-[#EDF2EE]">BỎ QUA / ĐÓNG HỒ SƠ</div>
                      <div className="text-xs text-[#86949B]">Hồ sơ này không có dấu hiệu vi phạm hoặc là báo cáo nhầm.</div>
                   </div>
                   <button onClick={() => handleAction('ignored')} className="bg-[#2A363D] text-[#EDF2EE] px-4 py-2 rounded font-bold hover:bg-[#86949B] transition-colors uppercase tracking-widest text-xs">
                      Xác nhận bỏ qua
                   </button>
                </div>

                {/* Action 2: Cảnh báo */}
                <div className="border border-[#2A363D] p-4 flex justify-between items-center rounded bg-[#172127]">
                   <div>
                      <div className="font-bold text-[#E7A64A]">CẢNH BÁO NẠN NHÂN</div>
                      <div className="text-xs text-[#86949B]">Yêu cầu: Ít nhất 1 bằng chứng. Hiệu tại: {caseEvidence.length}/1</div>
                   </div>
                   <button disabled={caseEvidence.length < 1} onClick={() => handleAction('warned')} className="bg-[#E7A64A] text-black px-4 py-2 rounded font-bold disabled:opacity-50 hover:bg-yellow-500 transition-colors uppercase tracking-widest text-xs">
                      Gửi cảnh báo
                   </button>
                </div>

                {/* Action 3: Đóng băng */}
                <div className="border border-[#2A363D] p-4 flex justify-between items-center rounded bg-[#172127]">
                   <div>
                      <div className="font-bold text-[#FF5B5B]">ĐÓNG BĂNG TÀI KHOẢN ĐÍCH</div>
                      <div className="text-xs text-[#86949B]">Yêu cầu: 2 bằng chứng & 1 liên kết đồ thị. Hiện tại: {caseEvidence.length}/2 bằng chứng, {hasLink ? 'Đã có' : 'Chưa có'} liên kết.</div>
                   </div>
                   <button disabled={caseEvidence.length < 2 || !hasLink} onClick={() => handleAction('frozen')} className="bg-[#FF5B5B] text-black px-4 py-2 rounded font-bold disabled:opacity-50 hover:bg-red-500 transition-colors uppercase tracking-widest text-xs">
                      Yêu cầu đóng băng
                   </button>
                </div>

                {/* Action 4: Ban / Escalated */}
                <div className="border border-[#2A363D] p-4 flex justify-between items-center rounded bg-[#172127]">
                   <div>
                      <div className="font-bold text-[#FF5B5B]">CHUYỂN GIAO CƠ QUAN CHỨC NĂNG</div>
                      <div className="text-xs text-[#86949B]">Yêu cầu: 3 bằng chứng & 2 loại thực thể. Hiện tại: {caseEvidence.length}/3 bằng chứng, {entityTypes.size}/2 loại.</div>
                   </div>
                   <button disabled={caseEvidence.length < 3 || entityTypes.size < 2} onClick={() => handleAction('escalated')} className="bg-[#FF5B5B] text-black px-4 py-2 rounded font-bold disabled:opacity-50 hover:bg-red-500 transition-colors uppercase tracking-widest text-xs flex items-center gap-2">
                      <ShieldAlert size={14} /> Triệt phá
                   </button>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}
