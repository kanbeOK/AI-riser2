const fs = require('fs');
let content = fs.readFileSync('src/components/apartment/Apartment.tsx', 'utf8');

const targetImport = "import { Monitor, Bed, Refrigerator, DoorClosed, AlertTriangle } from 'lucide-react';";
const replacementImport = "import { Monitor, Bed, Refrigerator, DoorClosed, AlertTriangle, Laptop, Search } from 'lucide-react';";
content = content.replace(targetImport, replacementImport);

const hotspotStart = "{/* Hotspot: Fridge */}";
const newHotspot = `{/* Hotspot: Laptop (Side Job) */}
            <button 
              onMouseEnter={() => setActiveZone('laptop')}
              onMouseLeave={() => setActiveZone(null)}
              className="absolute top-1/2 left-1/2 group"
            >
               <div className="relative z-10 w-24 h-16 bg-[#172127] border-2 border-[#2A363D] group-hover:border-[#F2B35D] transition-all flex items-center justify-center shadow-lg rounded">
                  <Laptop size={24} className="text-[#F2B35D] opacity-40 group-hover:opacity-100" />
               </div>
               {activeZone === 'laptop' && (
                  <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="absolute -top-32 left-1/2 -translate-x-1/2 bg-[#11171C] border border-[#F2B35D] p-4 rounded text-[#E9EEE9] whitespace-nowrap text-xs z-20 flex flex-col gap-2 min-w-[200px]">
                     <div className="font-bold text-[#F2B35D] uppercase border-b border-[#2A363D] pb-2 text-center">Việc làm thêm</div>
                     {!state.activeSideJob ? (
                       <div className="flex flex-col gap-2">
                         <button onClick={(e) => { e.stopPropagation(); handleAction('START_JOB', { job: { id: 'j1', name: 'Đánh máy', progress: 0, maxProgress: 1, reward: 20 } }); }} className="px-3 py-2 bg-[#2A363D] hover:bg-[#F2B35D] hover:text-black rounded text-xs">
                           Nhận việc gõ văn bản (+20 CR)
                         </button>
                       </div>
                     ) : (
                       <div className="flex flex-col gap-2 items-center">
                         <div className="text-xs text-[#86949B]">Tiến độ: {state.activeSideJob.progress}/{state.activeSideJob.maxProgress}</div>
                         <button onClick={(e) => { e.stopPropagation(); handleAction('WORK_JOB', { progress: 1 }); }} className="px-4 py-2 bg-[#F2B35D] text-black font-bold rounded hover:bg-[#F4C584]">
                           Làm việc (-5 Năng lượng)
                         </button>
                       </div>
                     )}
                     <div className="mt-2 border-t border-[#2A363D] pt-2 flex flex-col gap-2">
                        <div className="text-xs text-[#86949B]">Hóa đơn Internet: 12 CR / ngày</div>
                        {state.internetPaidThroughDay >= state.day ? (
                          <div className="text-xs text-[#45D6BF] text-center">Đã thanh toán</div>
                        ) : (
                          <button onClick={(e) => { e.stopPropagation(); handleAction('PAY_INTERNET', {}); }} disabled={state.credits < 12} className="px-2 py-1 bg-[#2A363D] hover:bg-[#F2B35D] hover:text-black rounded text-[10px]">Thanh toán (12 CR)</button>
                        )}
                     </div>
                  </motion.div>
               )}
            </button>
            
            `;

content = content.replace(hotspotStart, newHotspot + hotspotStart);

fs.writeFileSync('src/components/apartment/Apartment.tsx', content);
