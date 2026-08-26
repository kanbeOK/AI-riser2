import React from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { Database, Network } from 'lucide-react';

export function EvidenceTray({ state, dispatch, onOpenTool }: { state: CampaignState, dispatch: React.Dispatch<GameAction>, onOpenTool: (t: 'osint' | 'graph') => void }) {
  return (
    <div className="h-32 bg-[#0A1218] border-t border-[#2A363D] flex items-center p-4 gap-4 flex-shrink-0 relative">
       <div className="flex flex-col gap-2 border-r border-[#2A363D] pr-4">
          <button onClick={() => onOpenTool('osint')} className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#63E6C5] hover:bg-[#63E6C5]/10 px-4 py-2 rounded transition-colors border border-[#63E6C5]/30">
             <Database size={14} /> Tra cứu OSINT
          </button>
          <button onClick={() => onOpenTool('graph')} className="flex items-center gap-2 text-xs uppercase tracking-widest font-bold text-[#E7A64A] hover:bg-[#E7A64A]/10 px-4 py-2 rounded transition-colors border border-[#E7A64A]/30">
             <Network size={14} /> Lưới liên kết
          </button>
       </div>
       
       <div className="flex-1 overflow-x-auto flex items-center gap-4 px-2 pb-2">
          {state.evidence.length === 0 ? (
             <div className="text-[#86949B] text-xs uppercase tracking-widest opacity-50 italic">Dải bằng chứng trống</div>
          ) : (
             state.evidence.map(ev => (
                <div key={ev.id} className="h-20 min-w-[200px] bg-[#D8D0BB] p-2 flex flex-col shadow-md rotate-1 hover:rotate-0 transition-transform relative border-t-8 border-yellow-600">
                   <div className="text-[10px] font-mono text-black/60 uppercase border-b border-black/10 pb-1 mb-1 truncate">{ev.label}</div>
                   <div className="text-xs text-black font-serif font-bold break-words leading-tight">{ev.displayValue || ev.value}</div>
                </div>
             ))
          )}
       </div>
    </div>
  );
}
