import React, { useState } from 'react';
import { CampaignState, GameAction, CaseFileState } from '../../game/state/types';

export function CaseView({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [newCaseTitle, setNewCaseTitle] = useState("");

  const cases = Object.values(state.cases);
  const selectedCase = selectedCaseId ? state.cases[selectedCaseId] : null;

  const handleCreate = () => {
    if (!newCaseTitle.trim()) return;
    const id = `case_${state.day}_${state.minuteOfDay}_${Object.keys(state.cases).length}`;
    dispatch({ type: 'CREATE_CASE', payload: { id, title: newCaseTitle } });
    setNewCaseTitle("");
    setSelectedCaseId(id);
  };

  const handleAssignEvidence = (evidenceId: string) => {
    if (!selectedCaseId) return;
    dispatch({ type: 'ASSIGN_EVIDENCE', payload: { evidenceId, caseId: selectedCaseId } });
  };

  // Get unassigned evidence
  const unassignedEvidence = state.evidence.filter(e => !e.caseId);
  const assignedEvidence = state.evidence.filter(e => e.caseId === selectedCaseId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full text-sm">
      {/* Case List */}
      <div className="bg-[#11171C] border border-[#2A363D] rounded-xl flex flex-col overflow-hidden h-[500px] col-span-1">
        <div className="p-3 border-b border-[#2A363D] bg-[#172127] font-bold text-xs text-[#F2B35D]">
           DANH SÁCH HỒ SƠ
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {cases.length === 0 && (
            <div className="text-center text-[#86949B] p-4 text-xs italic">
              Chưa có hồ sơ nào.
            </div>
          )}
          {cases.map(c => (
            <button 
              key={c.id} 
              onClick={() => setSelectedCaseId(c.id)}
              className={`w-full text-left p-3 rounded border transition-colors ${selectedCaseId === c.id ? 'bg-[#2A363D] border-[#45D6BF] text-[#E9EEE9]' : 'bg-[#172127] border-transparent hover:border-[#2A363D] text-[#86949B]'}`}
            >
              <div className="font-bold">{c.title}</div>
              <div className="text-[10px] mt-1 flex justify-between">
                <span>{c.evidenceIds.length} Bằng chứng</span>
                <span className={`uppercase ${c.status === 'open' ? 'text-[#45D6BF]' : 'text-[#FF5A5F]'}`}>{c.status}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-[#2A363D] bg-[#172127] shrink-0">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newCaseTitle}
              onChange={(e) => setNewCaseTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="flex-1 bg-[#11171C] border border-[#2A363D] rounded px-2 py-1.5 text-xs text-[#E9EEE9] focus:outline-none focus:border-[#F2B35D]"
              placeholder="Tên hồ sơ mới..."
            />
            <button onClick={handleCreate} className="px-3 py-1.5 bg-[#F2B35D] text-[#080B0E] font-bold rounded text-xs hover:bg-[#F4C584] transition-colors">
              +
            </button>
          </div>
        </div>
      </div>

      {/* Case Details */}
      <div className="bg-[#11171C] border border-[#2A363D] rounded-xl flex flex-col overflow-hidden h-[500px] col-span-2">
        {!selectedCase ? (
          <div className="flex-1 flex items-center justify-center text-[#86949B] p-8 text-center border-2 border-dashed border-[#2A363D] m-4 rounded-xl">
             <div className="flex flex-col items-center">
               <div className="text-3xl mb-2">📄</div>
               Chọn một hồ sơ bên trái hoặc tạo mới để xem chi tiết.
             </div>
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-[#2A363D] bg-[#172127] shrink-0 flex justify-between items-start">
               <div>
                 <div className="text-[#86949B] text-[10px] mb-1 font-mono">{selectedCase.id}</div>
                 <h2 className="text-xl font-bold text-[#E9EEE9]">{selectedCase.title}</h2>
               </div>
               <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${selectedCase.status === 'open' ? 'bg-[#45D6BF]/20 text-[#45D6BF]' : 'bg-[#FF5A5F]/20 text-[#FF5A5F]'}`}>
                 {selectedCase.status}
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 flex gap-4">
               {/* Evidence in this case */}
               <div className="flex-1 border border-[#2A363D] rounded bg-[#172127] flex flex-col">
                 <div className="p-2 border-b border-[#2A363D] font-bold text-xs text-[#E9EEE9] bg-[#2A363D]">
                   BẰNG CHỨNG TRONG HỒ SƠ
                 </div>
                 <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                   {assignedEvidence.length === 0 ? (
                     <div className="text-center text-[#86949B] text-xs mt-4">Kéo thả bằng chứng vào đây (chức năng sắp ra mắt) hoặc nhấp từ danh sách bên phải.</div>
                   ) : (
                     assignedEvidence.map(e => (
                       <div key={e.id} className="p-2 bg-[#11171C] border border-[#45D6BF]/30 rounded text-xs">
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-[#45D6BF]">{e.label}</span>
                            <span className="text-[#86949B] text-[10px] uppercase">{e.entityType}</span>
                          </div>
                          <div className="text-[#E9EEE9]">{e.value}</div>
                       </div>
                     ))
                   )}
                 </div>
               </div>

               {/* Unassigned evidence */}
               <div className="w-64 border border-[#2A363D] rounded bg-[#172127] flex flex-col shrink-0">
                 <div className="p-2 border-b border-[#2A363D] font-bold text-xs text-[#86949B] bg-[#2A363D]">
                   BẰNG CHỨNG TỰ DO
                 </div>
                 <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                   {unassignedEvidence.length === 0 ? (
                     <div className="text-center text-[#86949B] text-[10px] mt-4">Không có bằng chứng chưa phân loại.</div>
                   ) : (
                     unassignedEvidence.map(e => (
                       <button 
                         key={e.id} 
                         onClick={() => handleAssignEvidence(e.id)}
                         className="w-full text-left p-2 bg-[#11171C] border border-[#2A363D] hover:border-[#F2B35D] rounded text-xs transition-colors group"
                         title="Thêm vào hồ sơ này"
                       >
                          <div className="flex justify-between mb-1">
                            <span className="font-bold text-[#F2B35D] truncate">{e.label}</span>
                            <span className="opacity-0 group-hover:opacity-100 text-[#45D6BF]">➔</span>
                          </div>
                          <div className="text-[#E9EEE9] truncate">{e.value}</div>
                       </button>
                     ))
                   )}
                 </div>
               </div>
            </div>
            
            <div className="p-4 border-t border-[#2A363D] bg-[#172127] shrink-0 flex justify-between items-center">
              <div className="text-xs text-[#86949B]">Quyết định can thiệp:</div>
              <div className="flex gap-2">
                <button 
                  onClick={() => dispatch({ type: 'OPERATIONAL_ACTION', payload: { caseId: selectedCase.id, action: 'warned' } })}
                  disabled={selectedCase.status !== 'open'} 
                  className="px-4 py-2 bg-[#F2B35D] hover:bg-[#F4C584] text-[#080B0E] font-bold rounded text-xs transition-colors disabled:opacity-50"
                >
                  Cảnh báo Nạn nhân
                </button>
                <button 
                  onClick={() => dispatch({ type: 'OPERATIONAL_ACTION', payload: { caseId: selectedCase.id, action: 'frozen' } })}
                  disabled={selectedCase.status !== 'open'} 
                  className="px-4 py-2 bg-[#45D6BF] hover:bg-[#6DA8FF] text-[#080B0E] font-bold rounded text-xs transition-colors disabled:opacity-50"
                >
                  Đóng băng Tài khoản
                </button>
                <button 
                  onClick={() => dispatch({ type: 'OPERATIONAL_ACTION', payload: { caseId: selectedCase.id, action: 'banned' } })}
                  disabled={selectedCase.status !== 'open'} 
                  className="px-4 py-2 bg-[#FF5A5F] hover:bg-[#FF7A7F] text-[#080B0E] font-bold rounded text-xs transition-colors disabled:opacity-50"
                >
                  Chuyển hồ sơ Cảnh sát
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
