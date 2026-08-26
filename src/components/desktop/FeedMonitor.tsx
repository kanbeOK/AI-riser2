import React, { useState, useRef, useEffect } from 'react';
import { CampaignState, GameAction, FeedState } from '../../game/state/types';
import { SCENARIOS } from '../../game/content/scenarios';
import { Activity, ShieldAlert, FolderOpen, MoreVertical, Send } from 'lucide-react';

export function FeedMonitor({ feed, state, dispatch, isMain, onOpenCase }: { feed: FeedState, state: CampaignState, dispatch: React.Dispatch<GameAction>, isMain: boolean, onOpenCase: () => void }) {
  const scen = SCENARIOS[feed.id];
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [feed.messages.length]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    const history = feed.messages.map(m => ({
      role: m.senderId === 'scammer' ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));

    try {
      const response = await fetch('/api/scenarios/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: feed.id,
          userMessage: userMsg,
          history
        })
      });
      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      
      const triggerMin = state.minuteOfDay + 1;
      const respId = `m_${state.day}_${triggerMin}_${feed.messages.length}`;
      
      dispatch({ type: 'PROCESS_EVENT', payload: {
         event: {
            id: `u_${Date.now()}`, day: state.day, minute: state.minuteOfDay, type: 'feed_message',
            payload: { feedId: feed.id, message: { id: `user_${Date.now()}`, senderId: 'user', senderName: 'Tôi', text: userMsg, timestamp: state.minuteOfDay, clues: [] } }
         }
      }});

      dispatch({ type: 'PROCESS_EVENT', payload: {
         event: {
            id: respId, day: state.day, minute: triggerMin, type: 'feed_message',
            payload: { feedId: feed.id, message: { id: respId, senderId: 'scammer', senderName: scen?.title || 'Unknown', text: data.message, timestamp: triggerMin, clues: data.clues || [] } }
         }
      }});
    } catch (e) {
       console.error(e);
    } finally {
       setLoading(false);
    }
  };

  const handleExtract = (clueId: string) => {
     if (scen?.evidenceBase[clueId]) {
        dispatch({ type: 'EXTRACT_EVIDENCE', payload: { token: { value: scen.evidenceBase[clueId].displayValue || "", ...scen.evidenceBase[clueId], feedId: feed.id, observedAt: state.minuteOfDay, caseId: feed.id, eventId: feed.id, confidence: 100, sourceRef: feed.id } } });
     }
  };

  return (
    <div className="flex flex-col h-full bg-[#10171C]">
       {/* Header */}
       <div className="bg-[#172127] p-2 flex items-center justify-between border-b border-[#2A363D] flex-shrink-0">
          <div className="flex items-center gap-2">
             <Activity size={16} className={feed.status === 'active' ? "text-[#63E6C5] animate-pulse" : "text-[#86949B]"} />
             <span className="text-sm font-bold text-[#EDF2EE] truncate">{feed.title}</span>
          </div>
          {isMain && (
             <button onClick={onOpenCase} className="flex items-center gap-1 bg-[#2A363D] hover:bg-[#63E6C5] hover:text-black px-2 py-1 rounded text-xs transition-colors">
                <FolderOpen size={14} /> Mở Hồ Sơ
             </button>
          )}
       </div>

       {/* Messages */}
       <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 font-mono text-sm">
          {feed.messages.map((m, i) => (
             <div key={i} className={`flex flex-col max-w-[85%] ${m.senderId === 'user' ? 'self-end items-end' : m.senderId === 'system' ? 'self-center items-center opacity-60 text-xs text-[#E7A64A]' : 'self-start items-start'}`}>
                <div className="text-[10px] text-[#86949B] mb-1">{m.senderName} • {Math.floor(m.timestamp/60)}:{(m.timestamp%60).toString().padStart(2,'0')}</div>
                <div className={`p-3 rounded-lg ${m.senderId === 'user' ? 'bg-[#2A363D] text-[#EDF2EE]' : m.senderId === 'system' ? 'bg-transparent border border-[#E7A64A]' : 'bg-[#172127] text-[#63E6C5] border-l-2 border-[#63E6C5]'}`}>
                   {m.text}
                   {m.clues && m.clues.length > 0 && isMain && (
                      <div className="mt-2 flex flex-wrap gap-2 border-t border-black/20 pt-2">
                         {m.clues.map(cId => {
                            const ev = scen?.evidenceBase[cId];
                            if (!ev) return null;
                            const isExtracted = state.evidence.some(e => e.id === cId);
                            return (
                               <button key={cId} onClick={() => handleExtract(cId)} disabled={isExtracted} className={`text-[10px] uppercase tracking-widest px-2 py-1 rounded border ${isExtracted ? 'border-[#86949B] text-[#86949B]' : 'border-[#E7A64A] text-[#E7A64A] hover:bg-[#E7A64A] hover:text-black'}`}>
                                  {isExtracted ? 'Đã ghim' : 'Ghim: ' + ev.label}
                               </button>
                            );
                         })}
                      </div>
                   )}
                </div>
             </div>
          ))}
          {loading && <div className="text-xs text-[#86949B] italic self-start animate-pulse">Đối tượng đang gõ...</div>}
       </div>

       {/* Input */}
       {isMain && feed.status === 'active' && (
          <div className="p-2 border-t border-[#2A363D] bg-[#07090C] flex gap-2 flex-shrink-0">
             <input type="text" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} placeholder="Nhập tin nhắn..." className="flex-1 bg-[#10171C] border border-[#2A363D] rounded px-3 py-2 text-sm text-[#EDF2EE] focus:outline-none focus:border-[#63E6C5]" />
             <button onClick={handleSend} disabled={loading || !input.trim()} className="bg-[#63E6C5] text-black px-4 py-2 rounded hover:bg-[#45D6BF] disabled:opacity-50">
                <Send size={16} />
             </button>
          </div>
       )}
    </div>
  );
}
