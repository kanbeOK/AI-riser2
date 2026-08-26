import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { Monitor, Bed, Refrigerator, DoorClosed, AlertTriangle, Laptop, Wifi } from 'lucide-react';
import { motion } from 'motion/react';

export function Apartment({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const handleAction = (type: any, payload: any) => {
    dispatch({ type, payload });
  };

  const formatTime = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const isInternetPaid = state.internetPaidThroughDay >= state.day;

  return (
    <div className="h-screen w-screen bg-[#07090C] text-[#EDF2EE] font-sans flex flex-col items-center justify-center relative overflow-hidden select-none">
      
      {/* Background Room & Window */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#10171C] to-[#07090C] opacity-50 z-0 pointer-events-none"></div>
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80vw] h-[40vh] border-8 border-[#10171C] bg-[#0A1218] flex items-end justify-center z-0 overflow-hidden shadow-inner">
         {/* City lights */}
         <div className="w-full h-full relative opacity-40">
           <div className="absolute bottom-0 left-[10%] w-16 h-48 bg-black"></div>
           <div className="absolute bottom-0 left-[30%] w-24 h-64 bg-black"></div>
           <div className="absolute bottom-0 left-[60%] w-20 h-56 bg-black"></div>
           <div className="absolute bottom-0 left-[80%] w-32 h-32 bg-black"></div>
           {/* Stars / lights */}
           <div className="absolute top-[20%] left-[15%] w-1 h-1 bg-[#E7A64A] animate-pulse"></div>
           <div className="absolute top-[40%] left-[35%] w-1 h-1 bg-[#63E6C5] animate-pulse"></div>
           <div className="absolute top-[30%] left-[70%] w-1 h-1 bg-[#FF5B5B] animate-pulse"></div>
         </div>
      </div>

      <div className="relative z-10 w-full max-w-5xl aspect-video bg-[#07090C]/80 border border-[#10171C] shadow-2xl rounded-xl p-8 backdrop-blur-md">
         
         <div className="absolute top-4 left-4 flex gap-4 text-xs font-mono tracking-widest opacity-80">
            <div className="bg-[#10171C] px-3 py-1 rounded border border-[#2A363D]">NGÀY: {state.day}</div>
            <div className="bg-[#10171C] px-3 py-1 rounded border border-[#2A363D]">TÀI KHOẢN: <span className="text-[#63E6C5]">{state.credits} CR</span></div>
            <div className="bg-[#10171C] px-3 py-1 rounded border border-[#2A363D]">NĂNG LƯỢNG: {Math.round(state.energy)}%</div>
            <div className="bg-[#10171C] px-3 py-1 rounded border border-[#2A363D]">ĐỘ ĐÓI: {Math.round(100 - state.hunger)}%</div>
         </div>
         
         {/* Central Room Layout */}
         <div className="w-full h-full relative mt-8 border-t-2 border-[#10171C]">
            
            {/* Workstation Desk */}
            <div 
              onMouseEnter={() => setActiveZone('workstation')}
              onMouseLeave={() => setActiveZone(null)}
              onClick={() => handleAction('CHANGE_LOCATION', { location: 'workstation' })}
              className="absolute bottom-10 right-10 group cursor-pointer"
            >
               <div className="relative z-10 w-48 h-32 bg-[#10171C] border-t-4 border-[#2A363D] group-hover:border-[#63E6C5] transition-all flex flex-col items-center justify-end shadow-2xl pb-4">
                  <Monitor size={48} className="text-[#63E6C5] opacity-50 group-hover:opacity-100 group-hover:animate-pulse mb-2" />
                  <div className="w-full h-1 bg-[#63E6C5] opacity-20 group-hover:opacity-100 mt-2"></div>
               </div>
               {activeZone === 'workstation' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#07090C] border border-[#63E6C5] px-4 py-2 rounded text-[#63E6C5] whitespace-nowrap text-xs font-bold uppercase tracking-widest z-20">
                     Vào ca trực
                  </motion.div>
               )}
            </div>

            {/* Bed */}
            <div 
              onMouseEnter={() => setActiveZone('bed')}
              onMouseLeave={() => setActiveZone(null)}
              onClick={() => handleAction('SLEEP', {})}
              className="absolute bottom-4 left-10 group cursor-pointer"
            >
               <div className="relative z-10 w-64 h-24 bg-[#10171C] border-2 border-[#2A363D] group-hover:border-[#E7A64A] transition-all flex items-center justify-center shadow-lg rounded-tr-3xl">
                  <Bed size={48} className="text-[#E7A64A] opacity-30 group-hover:opacity-100" />
               </div>
               {activeZone === 'bed' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#07090C] border border-[#E7A64A] px-4 py-2 rounded text-[#E7A64A] whitespace-nowrap text-xs font-bold uppercase tracking-widest z-20">
                     Đi ngủ (Sang ngày mới)
                  </motion.div>
               )}
            </div>

            {/* Laptop / Side Job on a small side table */}
            <div 
              onMouseEnter={() => setActiveZone('laptop')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute bottom-32 left-[320px] group cursor-pointer"
            >
               <div className="relative z-10 w-24 h-16 bg-[#10171C] border border-[#2A363D] group-hover:border-[#E7A64A] transition-all flex items-center justify-center shadow-lg transform -skew-x-12">
                  <Laptop size={24} className="text-[#D8D0BB] opacity-40 group-hover:opacity-100" />
               </div>
               {activeZone === 'laptop' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#07090C] border border-[#E7A64A] p-4 rounded text-[#EDF2EE] whitespace-nowrap text-xs z-20 flex flex-col gap-2 min-w-[200px]">
                     <div className="font-bold text-[#E7A64A] uppercase border-b border-[#2A363D] pb-2 text-center">Làm thêm online</div>
                     {!state.activeSideJob ? (
                       <div className="flex flex-col gap-2">
                         <button onClick={(e) => { e.stopPropagation(); handleAction('START_JOB', { job: { id: 'j1', name: 'Đánh máy', progress: 0, maxProgress: 1, reward: 20 } }); }} className="px-3 py-2 bg-[#10171C] hover:bg-[#E7A64A] hover:text-[#07090C] rounded text-xs border border-[#2A363D]">
                           Nhận việc (+20 CR)
                         </button>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-2 items-center">
                         <div className="text-xs text-[#86949B]">Tiến độ: {state.activeSideJob.progress}/{state.activeSideJob.maxProgress}</div>
                         <button onClick={(e) => { e.stopPropagation(); handleAction('WORK_JOB', { progress: 1 }); }} className="px-4 py-2 bg-[#E7A64A] text-[#07090C] font-bold rounded hover:bg-[#F4C584]">
                           Làm việc (-5 Năng lượng)
                         </button>
                       </div>
                     )}
                  </motion.div>
               )}
            </div>
            
            {/* Router / Internet Bill */}
            <div 
              onMouseEnter={() => setActiveZone('router')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute top-20 right-[350px] group cursor-pointer"
            >
               <div className="relative z-10 w-12 h-16 bg-[#10171C] border border-[#2A363D] flex items-center justify-center shadow-lg">
                  <Wifi size={24} className={`${isInternetPaid ? 'text-[#63E6C5] animate-pulse' : 'text-[#FF5B5B] opacity-50'} group-hover:opacity-100 transition-opacity`} />
               </div>
               {activeZone === 'router' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-24 left-1/2 -translate-x-1/2 bg-[#07090C] border border-[#2A363D] p-4 rounded text-[#EDF2EE] whitespace-nowrap text-xs z-20 flex flex-col gap-2 min-w-[200px]">
                     <div className="font-bold text-[#D8D0BB] uppercase border-b border-[#2A363D] pb-2 text-center">Mạng Internet</div>
                     <div className="text-xs text-[#86949B] text-center">Gói cước ngày: 12 CR</div>
                     {isInternetPaid ? (
                        <div className="text-xs text-[#63E6C5] text-center font-bold">Đã thanh toán hôm nay</div>
                     ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleAction('PAY_INTERNET', {}); }} disabled={state.credits < 12} className="px-2 py-2 bg-[#10171C] hover:bg-[#63E6C5] hover:text-[#07090C] border border-[#2A363D] rounded text-xs disabled:opacity-50">Thanh toán ngay (12 CR)</button>
                     )}
                  </motion.div>
               )}
            </div>

            {/* Fridge */}
            <div 
              onMouseEnter={() => setActiveZone('fridge')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute bottom-20 left-[480px] group cursor-pointer"
            >
               <div className="relative z-10 w-24 h-48 bg-[#10171C] border border-[#2A363D] group-hover:border-[#E7A64A] transition-all flex items-center justify-center shadow-lg">
                  <Refrigerator size={32} className="text-[#D8D0BB] opacity-40 group-hover:opacity-100" />
               </div>
               {activeZone === 'fridge' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-16 left-1/2 -translate-x-1/2 bg-[#07090C] border border-[#E7A64A] p-4 rounded text-[#E7A64A] whitespace-nowrap text-xs font-bold uppercase tracking-widest z-20 flex flex-col gap-2">
                     <span className="text-center">Tủ lạnh</span>
                     <div className="flex gap-2">
                        {state.inventory.length === 0 ? <span className="opacity-50 text-[#EDF2EE]">Trống rỗng</span> : state.inventory.map(i => (
                           <button key={i.id} onClick={(e) => { e.stopPropagation(); handleAction('EAT', { itemId: i.id }); }} className="px-3 py-1.5 bg-[#10171C] hover:bg-[#E7A64A] hover:text-[#07090C] border border-[#2A363D] rounded text-[10px]">Ăn {i.name}</button>
                        ))}
                     </div>
                  </motion.div>
               )}
            </div>

            {/* Door / Bills */}
            <div 
              onMouseEnter={() => setActiveZone('door')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute top-10 left-10 group cursor-pointer"
            >
               <div className="relative z-10 w-32 h-64 border-2 border-[#10171C] bg-[#07090C] group-hover:border-[#FF5B5B] transition-all flex flex-col items-center justify-center shadow-lg">
                  <DoorClosed size={48} className="text-[#FF5B5B] opacity-20 group-hover:opacity-100" />
                  {!state.rentPaid && state.day >= state.rentDueDay && <AlertTriangle size={24} className="absolute top-4 text-[#FF5B5B] animate-pulse" />}
                  {/* Bill envelope pinned on door */}
                  {!state.rentPaid && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-8 bg-[#D8D0BB] shadow transform rotate-6 border border-gray-400"></div>}
               </div>
               {activeZone === 'door' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute top-1/2 -right-6 translate-x-full -translate-y-1/2 bg-[#07090C] border border-[#FF5B5B] p-4 rounded text-[#EDF2EE] whitespace-nowrap text-xs z-20 flex flex-col gap-2 min-w-[200px]">
                     <div className="font-bold text-[#FF5B5B] uppercase border-b border-[#2A363D] pb-2 mb-2">Thông báo Tiền Nhà</div>
                     <div>Hạn chót thanh toán: Ngày {state.rentDueDay}</div>
                     <div className="text-xl text-[#FF5B5B] my-2 font-mono">{state.rentAmount} CR</div>
                     {state.rentPaid ? (
                        <div className="px-4 py-2 bg-[#63E6C5]/20 text-[#63E6C5] text-center font-bold rounded">Đã thanh toán</div>
                     ) : (
                        <button onClick={(e) => { e.stopPropagation(); handleAction('PAY_RENT', {}); }} disabled={state.credits < state.rentAmount} className="px-4 py-2 bg-[#FF5B5B] hover:bg-red-500 disabled:bg-[#10171C] disabled:text-[#86949B] disabled:border disabled:border-[#2A363D] text-[#07090C] font-bold rounded">
                           Đóng tiền nhà
                        </button>
                     )}
                  </motion.div>
               )}
            </div>
         </div>
      </div>
    </div>
  );
}
