import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { Monitor, Bed, Refrigerator, DoorClosed, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function Apartment({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const formatTime = (minutes: number) => {
    const h = Math.floor(minutes / 60).toString().padStart(2, '0');
    const m = (minutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  const handleAction = (type: string, payload: any) => {
    dispatch({ type, payload } as any);
  };

  return (
    <div className="h-screen w-screen bg-[#071018] text-[#E9EEE9] overflow-hidden flex flex-col font-mono relative">
      
      {/* HUD Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-50 pointer-events-none">
        <div>
          <h1 className="text-4xl font-serif font-black text-[#D88946] drop-shadow-[0_0_15px_rgba(216,137,70,0.5)]">CĂN HỘ 404</h1>
          <p className="text-sm opacity-70">NGÀY {state.day} - {formatTime(state.minuteOfDay)}</p>
        </div>
        
        <div className="flex gap-6 text-right">
           <div className="bg-[#11171C]/80 border border-[#2A363D] p-3 rounded-xl pointer-events-auto backdrop-blur-sm">
             <div className="text-[10px] opacity-50 uppercase tracking-widest text-[#45D6BF]">Tín dụng</div>
             <div className="text-xl font-bold text-[#45D6BF]">{state.credits} CR</div>
           </div>
           <div className="bg-[#11171C]/80 border border-[#2A363D] p-3 rounded-xl pointer-events-auto backdrop-blur-sm">
             <div className="text-[10px] opacity-50 uppercase tracking-widest">Sức khỏe</div>
             <div className="flex items-center gap-2 text-sm mt-1">
                <span className={state.hunger < 30 ? "text-[#FF5A5F]" : "text-white"}>Đói: {Math.round(state.hunger)}%</span>
                <span className="opacity-30">|</span>
                <span className={state.energy < 30 ? "text-[#FF5A5F]" : "text-white"}>Năng lượng: {Math.round(state.energy)}%</span>
             </div>
           </div>
        </div>
      </div>

      {/* 2D Room Container */}
      <div className="flex-1 relative bg-[radial-gradient(#11171C_1px,transparent_1px)] [background-size:40px_40px] flex items-center justify-center">
         
         {/* Room Bounds */}
         <div className="relative w-full max-w-5xl aspect-video border-b-2 border-l-2 border-[#2A363D] bg-gradient-to-tr from-[#080B0E] to-[#11171C] shadow-2xl">
            
            {/* Window */}
            <div className="absolute top-1/4 right-0 w-64 h-48 border-2 border-r-0 border-[#2A363D] bg-[#071018] overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-t from-[#D88946]/20 to-transparent"></div>
               {/* Cyberpunk City details */}
               <div className="absolute bottom-0 w-full h-24 flex items-end gap-1 px-2 opacity-30">
                  <div className="w-1/4 h-16 bg-[#F2B35D]"></div>
                  <div className="w-1/3 h-20 bg-[#45D6BF]"></div>
                  <div className="w-1/5 h-10 bg-[#FF5A5F]"></div>
               </div>
            </div>

            {/* Hotspot: Workstation */}
            <button 
              onMouseEnter={() => setActiveZone('workstation')}
              onMouseLeave={() => setActiveZone(null)}
              onClick={() => handleAction('CHANGE_LOCATION', { location: 'workstation' })}
              className="absolute bottom-12 right-24 group"
            >
               <div className="relative z-10 w-48 h-32 bg-[#172127] border-2 border-[#2A363D] group-hover:border-[#45D6BF] transition-all flex flex-col items-center justify-center shadow-[0_0_30px_rgba(69,214,191,0.1)] group-hover:shadow-[0_0_50px_rgba(69,214,191,0.3)]">
                  <Monitor size={48} className="text-[#45D6BF] opacity-50 group-hover:opacity-100 group-hover:animate-pulse" />
               </div>
               <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-64 h-8 bg-black/50 blur-xl"></div>
               {activeZone === 'workstation' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#11171C] border border-[#45D6BF] px-4 py-2 rounded text-[#45D6BF] whitespace-nowrap text-xs font-bold uppercase tracking-widest z-20">
                     Vào ca trực
                  </motion.div>
               )}
            </button>

            {/* Hotspot: Bed */}
            <button 
              onMouseEnter={() => setActiveZone('bed')}
              onMouseLeave={() => setActiveZone(null)}
              onClick={() => handleAction('SLEEP', {})}
              className="absolute bottom-4 left-12 group"
            >
               <div className="relative z-10 w-64 h-24 bg-[#11171C] border-2 border-[#2A363D] group-hover:border-[#6DA8FF] transition-all flex items-center justify-center shadow-lg rounded-tl-xl">
                  <Bed size={48} className="text-[#6DA8FF] opacity-30 group-hover:opacity-100" />
               </div>
               {activeZone === 'bed' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#11171C] border border-[#6DA8FF] px-4 py-2 rounded text-[#6DA8FF] whitespace-nowrap text-xs font-bold uppercase tracking-widest z-20">
                     Kết thúc ngày (Ngủ)
                  </motion.div>
               )}
            </button>

            {/* Hotspot: Fridge */}
            <button 
              onMouseEnter={() => setActiveZone('fridge')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute bottom-12 left-[320px] group"
            >
               <div className="relative z-10 w-24 h-48 bg-[#172127] border-2 border-[#2A363D] group-hover:border-[#F2B35D] transition-all flex items-center justify-center shadow-lg rounded">
                  <Refrigerator size={32} className="text-[#F2B35D] opacity-40 group-hover:opacity-100" />
               </div>
               {activeZone === 'fridge' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#11171C] border border-[#F2B35D] px-4 py-2 rounded text-[#F2B35D] whitespace-nowrap text-xs font-bold uppercase tracking-widest z-20 flex flex-col gap-2">
                     <span className="text-center">Tủ lạnh</span>
                     <div className="flex gap-2">
                        {state.inventory.length === 0 ? <span className="opacity-50">Trống rỗng</span> : state.inventory.map(i => (
                           <button key={i.id} onClick={(e) => { e.stopPropagation(); handleAction('EAT', { itemId: i.id }); }} className="px-2 py-1 bg-[#2A363D] hover:bg-[#F2B35D] hover:text-black rounded text-[10px]">Ăn {i.name}</button>
                        ))}
                     </div>
                  </motion.div>
               )}
            </button>

            {/* Hotspot: Door / Bills */}
            <button 
              onMouseEnter={() => setActiveZone('door')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute top-12 left-12 group"
            >
               <div className="relative z-10 w-32 h-64 border-2 border-[#2A363D] group-hover:border-[#FF5A5F] transition-all flex flex-col items-center justify-center shadow-lg rounded">
                  <DoorClosed size={48} className="text-[#FF5A5F] opacity-30 group-hover:opacity-100" />
                  {!state.rentPaid && <AlertTriangle size={24} className="absolute top-4 text-[#FF5A5F] animate-pulse" />}
               </div>
               {activeZone === 'door' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute top-1/2 -right-6 translate-x-full -translate-y-1/2 bg-[#11171C] border border-[#FF5A5F] p-4 rounded text-white whitespace-nowrap text-xs z-20 flex flex-col gap-2 min-w-[200px]">
                     <div className="font-bold text-[#FF5A5F] uppercase border-b border-[#2A363D] pb-2 mb-2">Hóa đơn</div>
                     <div>Tiền nhà đến hạn: Ngày {state.rentDueDay}</div>
                     <div className="text-xl text-[#FF5A5F] my-2">{state.rentAmount} CR</div>
                     {state.rentPaid ? (
                        <div className="px-4 py-2 bg-[#45D6BF]/20 text-[#45D6BF] text-center font-bold rounded">Đã thanh toán</div>
                     ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleAction('PAY_RENT', {}); }} disabled={state.credits < state.rentAmount} className="px-4 py-2 bg-[#FF5A5F] hover:bg-red-500 disabled:bg-[#2A363D] disabled:text-[#86949B] text-black font-bold rounded">
                           Thanh toán ngay
                        </button>
                     )}
                  </motion.div>
               )}
            </button>

         </div>
      </div>
    </div>
  );
}
