import React, { useState, useEffect } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { FeedView } from './FeedView';
import { CaseView } from './CaseView';

export function Workstation({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [activeApp, setActiveApp] = useState<string>("TÍN HIỆU");

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const navItems = ["TÍN HIỆU", "HỒ SƠ", "TRUY VẾT", "LIÊN KẾT", "ĐIỀU PHỐI"];

  // Inject a demo event if none exist and we are starting
  useEffect(() => {
    if (Object.keys(state.feeds).length === 0 && state.minuteOfDay > 8 * 60 && !state.processedEventIds.includes('demo_feed_1')) {
       // dispatch a dummy event to get started
       dispatch({ type: 'PROCESS_EVENT', payload: {
         event: {
           id: 'demo_feed_1',
           day: state.day,
           minute: state.minuteOfDay,
           type: 'feed_start',
           payload: {
             feedId: 'c1_qr_delivery',
             title: 'Mã QR Giao hàng',
             type: 'chat'
           }
         }
       }});
       
       dispatch({ type: 'PROCESS_EVENT', payload: {
         event: {
           id: 'demo_msg_1',
           day: state.day,
           minute: state.minuteOfDay + 1,
           type: 'feed_message',
           payload: {
             feedId: 'c1_qr_delivery',
             message: {
               id: 'msg_1',
               senderId: 'scammer',
               senderName: 'Shipper Giao Hàng Nhanh',
               text: 'Chào bạn, tôi là shipper. Bạn có đơn hàng 250k. Vui lòng quét mã QR này để thanh toán vì tôi đang vội.',
               timestamp: state.minuteOfDay + 1,
               clues: ['Mã QR', 'Gây áp lực thời gian']
             }
           }
         }
       }});
    }
  }, [state.minuteOfDay, state.feeds, state.day, dispatch, state.processedEventIds]);

  return (
    <div className="h-screen w-screen bg-[#080B0E] text-[#E9EEE9] flex flex-col font-mono overflow-hidden">
      {/* Top Bar */}
      <div className="h-10 bg-[#11171C] border-b border-[#2A363D] flex items-center justify-between px-4 shrink-0 text-xs">
         <div className="flex items-center gap-4 text-[#45D6BF] font-bold">
           <span>MẮT LƯỚI OS v1.0</span>
           <span>Niềm tin: {state.agencyTrust}%</span>
         </div>
         <div className="flex items-center gap-4">
           <span>{state.credits} CR</span>
           <span>Ngày {state.day}</span>
           <span>{formatTime(state.minuteOfDay)}</span>
           <div className="flex bg-[#172127] rounded overflow-hidden">
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 0 } })} className={`px-2 py-1 ${state.speed === 0 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}`}>⏸</button>
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 1 } })} className={`px-2 py-1 ${state.speed === 1 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}`}>1x</button>
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 2 } })} className={`px-2 py-1 ${state.speed === 2 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}`}>2x</button>
             <button onClick={() => dispatch({ type: 'SET_SPEED', payload: { speed: 4 } })} className={`px-2 py-1 ${state.speed === 4 ? 'bg-[#45D6BF] text-[#080B0E]' : 'hover:bg-[#2A363D]'}`}>4x</button>
           </div>
           <button onClick={() => dispatch({ type: 'CHANGE_LOCATION', payload: { location: 'apartment' } })} className="px-2 py-1 bg-[#2A363D] hover:bg-[#FF5A5F] rounded transition-colors text-white">Rời khỏi</button>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Dock */}
        <div className="w-16 bg-[#11171C] border-r border-[#2A363D] flex flex-col items-center py-4 gap-4 shrink-0">
           {navItems.map(item => (
             <button 
               key={item} 
               onClick={() => setActiveApp(item)} 
               className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-colors ${activeApp === item ? 'bg-[#45D6BF]/20 text-[#45D6BF] border border-[#45D6BF]/50' : 'text-[#86949B] hover:text-[#E9EEE9] hover:bg-[#172127]'}`}
               title={item}
             >
               {item[0]}
             </button>
           ))}
        </div>

        {/* Center Canvas */}
        <div className="flex-1 bg-black/40 p-4 overflow-auto">
          {activeApp === "TÍN HIỆU" && <FeedView state={state} dispatch={dispatch} />}
          {activeApp === "HỒ SƠ" && <CaseView state={state} dispatch={dispatch} />}
          {activeApp === "TRUY VẾT" && (
             <div className="text-center text-[#86949B] mt-20 border border-dashed border-[#2A363D] p-8 mx-auto max-w-lg rounded-xl">
                <div className="text-3xl mb-4">🔍</div>
                Hệ thống truy vết (OSINT) đang ngoại tuyến. Cần có Bằng Chứng loại Domain hoặc Tài Khoản để tra cứu.
             </div>
          )}
          {activeApp === "LIÊN KẾT" && (
             <div className="text-center text-[#86949B] mt-20 border border-dashed border-[#2A363D] p-8 mx-auto max-w-lg rounded-xl">
                <div className="text-3xl mb-4">🕸️</div>
                Biểu đồ liên kết trống. Cần ít nhất 2 Bằng Chứng để vẽ đường liên kết.
             </div>
          )}
          {activeApp === "ĐIỀU PHỐI" && (
             <div className="text-center text-[#86949B] mt-20 border border-dashed border-[#2A363D] p-8 mx-auto max-w-lg rounded-xl">
                <div className="text-3xl mb-4">⚖️</div>
                Không có vụ án nào chờ điều phối. Hãy hoàn thành thu thập bằng chứng ở thẻ Hồ Sơ.
             </div>
          )}
        </div>

        {/* Right Rail */}
        <div className="w-64 bg-[#11171C] border-l border-[#2A363D] flex flex-col shrink-0">
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
          <div key={n.id} className={`px-4 py-3 bg-[#11171C] border border-[#2A363D] rounded shadow-lg flex gap-3 items-center ${n.type === 'success' ? 'border-l-4 border-l-[#45D6BF]' : n.type === 'warning' ? 'border-l-4 border-l-[#F2B35D]' : n.type === 'info' ? 'border-l-4 border-l-[#6DA8FF]' : 'border-l-4 border-l-[#FF5A5F]'}`}>
            <span className="opacity-50 text-[10px] font-mono">[{formatTime(n.time)}]</span> 
            <span className="text-xs">{n.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
