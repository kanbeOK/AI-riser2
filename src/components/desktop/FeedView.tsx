import React, { useState } from 'react';
import { CampaignState, GameAction, FeedState } from '../../game/state/types';

export function FeedView({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [inputText, setInputText] = useState("");

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleSend = (feedId: string) => {
    if (!inputText.trim()) return;
    
    // Add player message
    const msg = {
      id: `m_${Date.now()}`,
      senderId: 'player',
      senderName: 'Bạn',
      text: inputText,
      timestamp: state.minuteOfDay,
      clues: []
    };
    
    dispatch({ type: 'PROCESS_EVENT', payload: { event: { id: `evt_${Date.now()}`, day: state.day, minute: state.minuteOfDay, type: 'feed_message', payload: { feedId, message: msg } } } });
    setInputText("");
    
    // In a real implementation, this would call /api/scenarios/turn to get a response
    // For now, let's simulate a response delay
    const responseEventId = `resp_${Date.now()}`;
    const triggerMin = state.minuteOfDay + 2;
    
    // We can dispatch an event to the future queue
    // Note: The current reducer handles PROCESS_EVENT immediately. 
    // To schedule it, we could add a SCHEDULE_EVENT action, but for brevity we'll just push to the state via a custom action or modify it.
    // Let's implement a simple direct timeout for now to simulate network:
    setTimeout(() => {
      dispatch({ type: 'PROCESS_EVENT', payload: { 
        event: { 
          id: responseEventId, 
          day: state.day, 
          minute: triggerMin, 
          type: 'feed_message', 
          payload: { 
            feedId, 
            message: {
               id: `m_${Date.now()}`,
               senderId: 'system',
               senderName: 'Hệ thống (Giả lập)',
               text: "Tính năng trò chuyện đang kết nối API...",
               timestamp: triggerMin,
               clues: []
            } 
          } 
        } 
      }});
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
      {Object.values(state.feeds).length === 0 && (
         <div className="col-span-full h-full flex flex-col items-center justify-center text-[#86949B] border border-dashed border-[#2A363D] rounded-xl p-8 text-center">
            <div className="text-4xl mb-4">📡</div>
            <div className="text-xl font-bold mb-2">Đang chờ tín hiệu</div>
            <div className="text-sm max-w-md">Chưa có giao dịch hay cuộc hội thoại nào bị chặn. Hãy chờ đợi hoặc tăng tốc thời gian.</div>
            <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 4 } })} className="mt-6 px-4 py-2 bg-[#2A363D] hover:bg-[#45D6BF] hover:text-[#080B0E] rounded transition-colors text-white text-xs font-bold uppercase tracking-widest">
              Tua nhanh thời gian
            </button>
         </div>
      )}
      {Object.values(state.feeds).map(feed => (
         <div key={feed.id} className="bg-[#11171C] border border-[#2A363D] rounded-xl flex flex-col overflow-hidden h-[500px]">
            <div className="p-3 border-b border-[#2A363D] bg-[#172127] font-bold text-xs flex justify-between items-center shrink-0">
               <span className="text-[#45D6BF] flex items-center gap-2">
                 <span className="w-2 h-2 rounded-full bg-[#45D6BF] animate-pulse"></span>
                 {feed.title}
               </span>
               <span className="text-[#86949B] px-2 py-1 bg-[#2A363D] rounded">{feed.type.toUpperCase()}</span>
            </div>
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
               {feed.messages.map(m => (
                 <div key={m.id} className={`flex flex-col text-sm max-w-[80%] ${m.senderId === 'player' ? 'ml-auto items-end' : ''}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-[#86949B]">{m.senderName}</span>
                      <span className="text-[#86949B] text-xs opacity-50">{formatTime(m.timestamp)}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${m.senderId === 'player' ? 'bg-[#2A363D] text-[#E9EEE9]' : 'bg-[#172127] border border-[#2A363D] text-[#D88946]'}`}>
                      {m.text}
                    </div>
                    {m.clues.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {m.clues.map(c => {
                          const isCollected = state.evidence.some(e => e.label === c && e.feedId === feed.id);
                          return (
                          <button 
                            key={c} 
                            onClick={() => !isCollected && dispatch({
                              type: 'EXTRACT_EVIDENCE',
                              payload: {
                                token: {
                                  id: `ev_${Date.now()}_${Math.floor(Math.random()*1000)}`,
                                  caseId: null,
                                  feedId: feed.id,
                                  eventId: m.id,
                                  entityType: 'domain', // Simple default for now
                                  label: c,
                                  value: c,
                                  observedAt: state.minuteOfDay,
                                  confidence: 100,
                                  sourceRef: m.id
                                }
                              }
                            })}
                            disabled={isCollected}
                            className={`text-[10px] px-1 rounded border transition-colors ${isCollected ? 'bg-[#45D6BF]/20 text-[#45D6BF] border-[#45D6BF]/50 cursor-default' : 'bg-[#F2B35D]/20 text-[#F2B35D] border-[#F2B35D]/50 hover:bg-[#F2B35D]/40'}`}
                          >
                            {isCollected ? '✓' : '🔍'} {c}
                          </button>
                        )})}
                      </div>
                    )}
                 </div>
               ))}
               {feed.messages.length === 0 && (
                 <div className="text-center text-[#86949B] text-sm mt-10 italic">
                   Kênh đã mở kết nối an toàn.
                 </div>
               )}
            </div>
            
            {feed.status === 'active' && (
              <div className="p-3 border-t border-[#2A363D] bg-[#172127] shrink-0">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend(feed.id)}
                    className="flex-1 bg-[#11171C] border border-[#2A363D] rounded px-3 py-2 text-sm text-[#E9EEE9] focus:outline-none focus:border-[#45D6BF]"
                    placeholder="Nhập tin nhắn..."
                  />
                  <button onClick={() => handleSend(feed.id)} className="px-4 py-2 bg-[#45D6BF] text-[#080B0E] font-bold rounded text-sm hover:bg-[#6DA8FF] transition-colors">
                    Gửi
                  </button>
                </div>
              </div>
            )}
         </div>
      ))}
    </div>
  );
}
