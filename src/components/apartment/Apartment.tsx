import React from 'react';
import { CampaignState, GameAction } from '../../game/state/types';

export function Apartment({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  
  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return (
    <div className="min-h-screen bg-[#080B0E] text-[#E9EEE9] p-8 flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-20">
         <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#D88946] rounded-full blur-[150px]"></div>
      </div>
      
      <div className="flex justify-between items-start relative z-10">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#D88946]">Căn hộ 404</h1>
          <p className="text-sm opacity-70">Ngày {state.day} - {formatTime(state.minuteOfDay)}</p>
        </div>
        
        <div className="flex gap-6 text-right">
           <div>
             <div className="text-xs opacity-50 uppercase tracking-widest">Tài khoản</div>
             <div className="text-2xl font-mono text-[#45D6BF]">{state.credits} CR</div>
           </div>
           <div>
             <div className="text-xs opacity-50 uppercase tracking-widest">Đói</div>
             <div className="text-xl font-mono">{state.hunger.toFixed(0)}/100</div>
           </div>
           <div>
             <div className="text-xs opacity-50 uppercase tracking-widest">Năng lượng</div>
             <div className="text-xl font-mono">{state.energy.toFixed(0)}/100</div>
           </div>
        </div>
      </div>
      
      <div className="flex-1 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
         <button onClick={() => dispatch({ type: 'CHANGE_LOCATION', payload: { location: 'workstation' } })} className="p-8 bg-[#11171C] border border-[#2A363D] hover:border-[#45D6BF] rounded-lg transition-colors flex flex-col items-center justify-center gap-4 text-center group">
            <div className="w-16 h-16 bg-[#172127] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">💻</div>
            <div>
              <div className="font-bold text-lg text-[#45D6BF]">Bàn làm việc</div>
              <div className="text-sm opacity-60">Bắt đầu ca trực MẮT LƯỚI</div>
            </div>
         </button>
         
         <button onClick={() => dispatch({ type: 'SLEEP', payload: {} })} className="p-8 bg-[#11171C] border border-[#2A363D] hover:border-[#6DA8FF] rounded-lg transition-colors flex flex-col items-center justify-center gap-4 text-center group">
            <div className="w-16 h-16 bg-[#172127] rounded-full flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">🛏️</div>
            <div>
              <div className="font-bold text-lg text-[#6DA8FF]">Giường ngủ</div>
              <div className="text-sm opacity-60">Ngủ để hồi phục năng lượng và qua ngày</div>
            </div>
         </button>
         
         <div className="p-8 bg-[#11171C] border border-[#2A363D] rounded-lg flex flex-col gap-4">
            <div className="font-bold text-lg border-b border-[#2A363D] pb-2 mb-2">Tủ lạnh & Đồ ăn</div>
            {state.inventory.length === 0 && <div className="text-sm opacity-50">Không còn đồ ăn.</div>}
            {state.inventory.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-[#172127] rounded">
                 <span>{item.name} (+{item.effectValue} Đói)</span>
                 <button onClick={() => dispatch({ type: 'EAT', payload: { itemId: item.id } })} className="px-3 py-1 bg-[#2A363D] hover:bg-[#45D6BF] hover:text-[#080B0E] text-xs font-bold rounded">Ăn</button>
              </div>
            ))}
         </div>
      </div>
      
      <div className="mt-8 p-6 bg-[#172127] border border-[#FF5A5F]/30 rounded-lg relative z-10 flex justify-between items-center">
         <div>
           <div className="font-bold text-[#FF5A5F]">Thông báo đóng tiền nhà</div>
           <div className="text-sm opacity-80">Hạn chót: Ngày {state.rentDueDay}. Số tiền: {state.rentAmount} CR.</div>
         </div>
         {state.rentPaid ? (
           <div className="px-4 py-2 bg-[#45D6BF]/20 text-[#45D6BF] text-sm font-bold rounded">Đã thanh toán</div>
         ) : (
           <button onClick={() => dispatch({ type: 'PAY_RENT', payload: {} })} disabled={state.credits < state.rentAmount} className="px-4 py-2 bg-[#FF5A5F] disabled:bg-[#2A363D] disabled:text-[#86949B] text-white text-sm font-bold rounded transition-colors">
             Thanh toán ngay
           </button>
         )}
      </div>
    </div>
  );
}
