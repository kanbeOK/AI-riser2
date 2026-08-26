const fs = require('fs');

const content = `import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { FeedView } from './FeedView';
import { CaseView } from './CaseView';
import { GraphView } from './GraphView';
import { OsintView } from './OsintView';
import { Activity, FolderOpen, Search, Link2, ShieldAlert, LogOut, Pause } from 'lucide-react';

export function Workstation({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [activeApp, setActiveApp] = useState<string>("TÍN HIỆU");

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return \`\${h}:\${m}\`;
  };

  const navItems = ["TÍN HIỆU", "HỒ SƠ", "TRUY VẾT", "LIÊN KẾT"];

  // Briefing screen if phase is morning and speed is 0
  if (state.phase === "morning" && state.speed === 0 && state.mode !== "demo") {
    return (
      <div className="h-screen w-screen bg-[#080B0E] text-[#E9EEE9] flex items-center justify-center font-mono">
        <div className="bg-[#11171C] border border-[#2A363D] p-8 rounded-xl max-w-lg text-center shadow-2xl">
          <h1 className="text-3xl font-bold text-[#45D6BF] mb-4">CHÀO BUỔI SÁNG, ĐẶC VỤ</h1>
          <p className="text-[#86949B] mb-8">
            Hôm nay là Ngày {state.day}. Mục tiêu của bạn là giám sát các tín hiệu khả nghi trên mạng lưới, 
            trích xuất bằng chứng, và ngăn chặn các hành vi lừa đảo trước khi quá muộn.
          </p>
          <button 
            onClick={() => {
              dispatch({ type: 'CHANGE_PHASE', payload: { phase: 'shift' } });
              dispatch({ type: 'SET_SPEED', payload: { speed: 1 } });
            }}
            className="px-6 py-3 bg-[#45D6BF] hover:bg-[#6DA8FF] text-[#080B0E] font-bold rounded transition-colors text-lg"
          >
            BẮT ĐẦU CA TRỰC
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#080B0E] text-[#E9EEE9] flex flex-col font-mono overflow-hidden">
      {/* Top Bar */}
      <div className="h-10 bg-[#11171C] border-b border-[#2A363D] flex items-center justify-between px-4 shrink-0 text-xs z-20 relative">
         <div className="flex items-center gap-4 text-[#45D6BF] font-bold">
           <span>MẮT LƯỚI OS v1.0</span>
           <span>Niềm tin: {state.agencyTrust}%</span>
         </div>
         <div className="flex items-center gap-4">
           <span>{state.credits} CR</span>
           <span>Ngày {state.day}</span>
           <span>{formatTime(state.minuteOfDay)}</span>
           <div className="flex bg-[#172127] rounded overflow-hidden">
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 0 } })} className={\`px-3 py-1 \${state.speed === 0 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}\`}><Pause size={14} /></button>
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 1 } })} className={\`px-3 py-1 text-xs font-bold \${state.speed === 1 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}\`}>1X</button>
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 2 } })} className={\`px-3 py-1 text-xs font-bold \${state.speed === 2 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}\`}>2X</button>
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 4 } })} className={\`px-3 py-1 text-xs font-bold \${state.speed === 4 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}\`}>4X</button>
           </div>
           <button onClick={() => dispatch({ type: 'CHANGE_LOCATION', payload: { location: 'apartment' } })} className="px-3 py-1 bg-[#2A363D] hover:bg-[#FF5A5F] rounded transition-colors text-white flex items-center gap-2"><LogOut size={14}/> Rời khỏi</button>
         </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Dock */}
        <div className="w-16 bg-[#11171C] border-r border-[#2A363D] flex flex-col items-center py-4 gap-4 shrink-0 z-20">
           {navItems.map(item => {
             let Icon = Activity;
             if (item === "HỒ SƠ") Icon = FolderOpen;
             if (item === "TRUY VẾT") Icon = Search;
             if (item === "LIÊN KẾT") Icon = Link2;
             
             return (
             <button 
               key={item} 
               onClick={() => setActiveApp(item)}
               className={\`w-12 h-12 rounded-lg flex items-center justify-center transition-colors \${activeApp === item ? 'bg-[#45D6BF]/20 text-[#45D6BF] border border-[#45D6BF]/50' : 'text-[#86949B] hover:text-[#E9EEE9] hover:bg-[#172127]'}\`}
               title={item}
             >
               <Icon size={24} />
             </button>
           ) } )}
        </div>
        
        {/* Center Canvas */}
        <div className="flex-1 bg-black/40 p-4 overflow-auto">
          {activeApp === "TÍN HIỆU" && <FeedView state={state} dispatch={dispatch} />}
          {activeApp === "HỒ SƠ" && <CaseView state={state} dispatch={dispatch} />}
          {activeApp === "TRUY VẾT" && <OsintView state={state} dispatch={dispatch} />}
          {activeApp === "LIÊN KẾT" && <GraphView state={state} dispatch={dispatch} />}
        </div>
        
        {/* Right Rail */}
        <div className="w-64 bg-[#11171C] border-l border-[#2A363D] flex flex-col shrink-0 z-20">
           <div className="p-3 border-b border-[#2A363D] font-bold text-sm text-[#F2B35D] flex justify-between items-center">
             <span>Bằng chứng thu thập</span>
             <span className="text-xs bg-[#2A363D] text-[#86949B] px-2 py-0.5 rounded-full">{state.evidence.length}</span>
           </div>
           <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {state.evidence.length === 0 && (
                <div className="text-xs text-[#86949B] text-center mt-10">
                  <div className="text-xl mb-2">🏷️</div>
                  Chưa có bằng chứng.<br/>Nhấp vào text tô sáng trong luồng chat để trích xuất.
                </div>
              )}
              {state.evidence.map(e => (
                 <div key={e.id} className="p-2 bg-[#172127] border border-[#2A363D] rounded text-xs flex flex-col gap-1">
                    <div className="flex justify-between">
                       <span className="font-bold text-[#F2B35D] truncate">{e.label}</span>
                       <span className="text-[#86949B] uppercase text-[10px]">{e.entityType}</span>
                    </div>
                    <div className="text-[#E9EEE9] truncate">{e.value}</div>
                 </div>
              ))}
           </div>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2 pointer-events-none z-50">
        {state.notifications.slice(-3).map(n => (
          <div key={n.id} className={\`px-4 py-3 bg-[#11171C] border border-[#2A363D] rounded shadow-lg flex gap-3 items-center \${n.type === 'success' ? 'border-l-4 border-l-[#45D6BF]' : n.type === 'warning' ? 'border-l-4 border-l-[#F2B35D]' : n.type === 'info' ? 'border-l-4 border-l-[#6DA8FF]' : 'border-l-4 border-l-[#FF5A5F]'}\`}>
            <span className="opacity-50 text-[10px] font-mono">[{formatTime(n.time)}]</span> 
            <span className="text-xs">{n.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
`;
fs.writeFileSync('src/components/desktop/Workstation.tsx', content);
