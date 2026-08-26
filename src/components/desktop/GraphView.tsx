import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { Link2 } from 'lucide-react';

export function GraphView({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [selected, setSelected] = useState<string[]>([]);
  
  const toggleSelect = (id: string) => {
    if (selected.includes(id)) setSelected(selected.filter(x => x !== id));
    else if (selected.length < 2) setSelected([...selected, id]);
  };
  
  const handleLink = () => {
    if (selected.length === 2) {
       dispatch({ 
         type: 'LINK_EVIDENCE', 
         payload: { 
           sourceId: selected[0] as string, 
           targetId: selected[1] as string, 
           label: 'Liên quan' 
         } 
       });
       setSelected([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#11171C] border border-[#2A363D] rounded-xl overflow-hidden relative">
      <div className="p-4 border-b border-[#2A363D] bg-[#172127] font-bold text-sm text-[#F2B35D] flex items-center gap-2 z-10 relative">
         <Link2 size={16} /> BIỂU ĐỒ LIÊN KẾT BẰNG CHỨNG
      </div>
      
      {/* Tools */}
      <div className="absolute top-16 left-4 z-10 bg-black/80 border border-[#2A363D] rounded p-2 text-xs flex flex-col gap-2">
         <div className="text-[#86949B]">Chọn 2 node để tạo liên kết</div>
         <button 
           onClick={handleLink}
           disabled={selected.length !== 2}
           className="w-full py-2 bg-[#45D6BF] text-[#080B0E] font-bold rounded disabled:opacity-30 disabled:bg-[#2A363D] disabled:text-[#86949B]"
         >
           TẠO LIÊN KẾT
         </button>
      </div>

      <div className="flex-1 relative bg-[radial-gradient(#2A363D_1px,transparent_1px)] [background-size:20px_20px] bg-black/50 overflow-hidden">
         <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {state.graphEdges.map(edge => {
               // Fake coordinates based on ID hash for demo purposes
               const sIdx = state.evidence.findIndex(e => e.id === edge.sourceId);
               const tIdx = state.evidence.findIndex(e => e.id === edge.targetId);
               if (sIdx < 0 || tIdx < 0) return null;
               
               const x1 = 150 + (sIdx % 3) * 150;
               const y1 = 150 + Math.floor(sIdx / 3) * 100;
               const x2 = 150 + (tIdx % 3) * 150;
               const y2 = 150 + Math.floor(tIdx / 3) * 100;
               
               return (
                 <line key={edge.id} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#45D6BF" strokeWidth="2" strokeDasharray="4 4" />
               );
            })}
         </svg>
         
         {state.evidence.map((e, i) => {
            const x = 150 + (i % 3) * 150;
            const y = 150 + Math.floor(i / 3) * 100;
            const isSelected = selected.includes(e.id);
            
            return (
              <button 
                key={e.id}
                onClick={() => toggleSelect(e.id)}
                className={`absolute w-24 h-24 -ml-12 -mt-12 rounded-full border-2 flex items-center justify-center text-center p-2 text-[10px] break-words transition-all duration-200 ${isSelected ? 'border-[#45D6BF] bg-[#45D6BF]/20 text-white scale-110 shadow-[0_0_15px_rgba(69,214,191,0.5)] z-20' : 'border-[#F2B35D] bg-[#11171C] text-[#F2B35D] hover:border-[#45D6BF] hover:text-white z-10'}`}
                style={{ left: x, top: y }}
              >
                {e.label}
              </button>
            );
         })}
         
         {state.evidence.length === 0 && (
           <div className="absolute inset-0 flex items-center justify-center text-[#86949B]">
              Chưa có dữ liệu để vẽ biểu đồ.
           </div>
         )}
      </div>
    </div>
  );
}
