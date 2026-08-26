import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { FeedMonitor } from './FeedMonitor';
import { EvidenceTray } from './EvidenceTray';
import { InvestigationOverlay } from './InvestigationOverlay';
import { Radio } from 'lucide-react';

export function Workstation({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [focusedFeedId, setFocusedFeedId] = useState<string | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<'osint' | 'graph' | 'case' | null>(null);
  const [focusedCaseId, setFocusedCaseId] = useState<string | null>(null);

  const feeds = Object.values(state.feeds);
  
  // If no focused feed, default to the first active one, or just null
  const mainFeed = feeds.find(f => f.id === focusedFeedId) || feeds.find(f => f.status === 'active') || feeds[0];
  const sideFeeds = feeds.filter(f => f.id !== mainFeed?.id);

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-screen w-screen bg-[#07090C] text-[#EDF2EE] font-sans flex flex-col overflow-hidden">
      {/* Top Bar / Desk Edge */}
      <div className="h-12 border-b border-[#2A363D] bg-[#10171C] flex items-center justify-between px-6 flex-shrink-0">
         <div className="flex items-center gap-4 text-xs font-mono tracking-widest text-[#86949B]">
            <span className="text-[#63E6C5] font-bold">MẮT LƯỚI - TRẠM #404</span>
            <span>NGÀY {state.day}</span>
            <span>{formatTime(state.minuteOfDay)}</span>
         </div>
         <div className="flex items-center gap-4">
            <button onClick={() => dispatch({ type: 'CHANGE_LOCATION', payload: { location: 'apartment' } })} className="text-xs uppercase tracking-widest text-[#E7A64A] hover:text-white transition-colors border border-[#E7A64A] px-3 py-1 rounded">
               Rời bàn làm việc
            </button>
         </div>
      </div>

      <div className="flex-1 flex relative p-4 gap-4 overflow-hidden">
         {/* Main Monitor */}
         <div className="flex-1 border border-[#2A363D] bg-[#10171C] rounded-lg shadow-2xl overflow-hidden relative flex flex-col">
            {mainFeed ? (
               <FeedMonitor feed={mainFeed} state={state} dispatch={dispatch} isMain={true} onOpenCase={() => { setFocusedCaseId(mainFeed.id); setActiveOverlay('case'); }} />
            ) : (
               <div className="flex-1 flex items-center justify-center text-[#86949B] font-mono opacity-50 uppercase tracking-widest">Không có tín hiệu</div>
            )}
         </div>

         {/* Side Monitors */}
         <div className="w-80 flex flex-col gap-4 overflow-y-auto pr-2 pb-4">
            {sideFeeds.map(feed => (
               <div key={feed.id} className="h-64 border border-[#2A363D] bg-[#10171C] rounded-lg shadow cursor-pointer hover:border-[#63E6C5] transition-colors relative" onClick={() => setFocusedFeedId(feed.id)}>
                  <div className="absolute inset-0 pointer-events-none">
                     <FeedMonitor feed={feed} state={state} dispatch={dispatch} isMain={false} onOpenCase={() => {}} />
                  </div>
                  <div className="absolute inset-0 bg-black/40 hover:bg-transparent transition-colors"></div>
               </div>
            ))}
            
            {/* Dispatch Radio */}
            <div className="mt-auto border border-[#2A363D] bg-[#10171C] p-4 rounded-lg flex flex-col gap-2">
               <div className="flex items-center gap-2 text-[#E7A64A] font-mono text-xs uppercase tracking-widest border-b border-[#2A363D] pb-2">
                  <Radio size={14} className="animate-pulse" /> Bộ đàm
               </div>
               <div className="h-24 overflow-y-auto text-xs text-[#86949B] font-mono flex flex-col gap-1">
                  {state.notifications.slice(-4).map(n => (
                     <div key={n.id} className={`${n.type === 'error' ? 'text-[#FF5B5B]' : n.type === 'success' ? 'text-[#63E6C5]' : n.type === 'warning' ? 'text-[#E7A64A]' : 'text-[#86949B]'}`}>
                        [{formatTime(n.time)}] {n.message}
                     </div>
                  ))}
               </div>
            </div>
         </div>
         
         {/* Overlays */}
         {activeOverlay && (
            <div className="absolute inset-0 z-40 bg-[#07090C]/80 backdrop-blur-sm flex items-center justify-center p-8">
               <div className="w-full h-full max-w-6xl max-h-[800px] bg-[#10171C] border border-[#2A363D] rounded-xl shadow-2xl flex flex-col overflow-hidden relative">
                  <button onClick={() => setActiveOverlay(null)} className="absolute top-4 right-6 text-[#86949B] hover:text-white z-50 text-xl font-bold">&times;</button>
                  <InvestigationOverlay type={activeOverlay} state={state} dispatch={dispatch} focusedCaseId={focusedCaseId} />
               </div>
            </div>
         )}
      </div>

      {/* Evidence Tray pinned at bottom */}
      <EvidenceTray state={state} dispatch={dispatch} onOpenTool={(tool) => setActiveOverlay(tool)} />
    </div>
  );
}
