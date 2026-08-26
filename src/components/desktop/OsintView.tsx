import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { Search, Loader2 } from 'lucide-react';

export function OsintView({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  
  const handleSearch = () => {
    if (!query) return;
    setSearching(true);
    setResult(null);
    setTimeout(() => {
       setSearching(false);
       // Simple mock result
       setResult(`Phân tích [${query}]: Độ tin cậy 45%. IP liên quan đến 3 vụ lừa đảo trước đó tại khu vực Đông Nam Á.`);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col h-full bg-[#11171C] border border-[#2A363D] rounded-xl overflow-hidden">
      <div className="p-4 border-b border-[#2A363D] bg-[#172127] font-bold text-sm text-[#F2B35D] flex items-center gap-2">
         <Search size={16} /> TRUY VẾT DỮ LIỆU (OSINT)
      </div>
      <div className="p-6 flex flex-col gap-6 items-center justify-center flex-1">
         <div className="w-full max-w-md flex flex-col gap-2">
            <label className="text-xs text-[#86949B] font-bold">NHẬP BẰNG CHỨNG CẦN TRA CỨU:</label>
            <div className="flex gap-2">
               <input 
                 className="flex-1 bg-black/50 border border-[#2A363D] rounded px-4 py-2 text-[#E9EEE9] focus:outline-none focus:border-[#45D6BF]" 
                 value={query}
                 onChange={e => setQuery(e.target.value)}
                 onKeyDown={e => e.key === 'Enter' && handleSearch()}
                 placeholder="Nhập IP, STK, Số điện thoại..."
               />
               <button 
                 onClick={handleSearch}
                 disabled={searching}
                 className="px-6 py-2 bg-[#45D6BF] text-[#080B0E] font-bold rounded hover:bg-[#6DA8FF] transition-colors disabled:opacity-50"
               >
                 TRA CỨU
               </button>
            </div>
            <p className="text-[10px] text-[#86949B]">Mẹo: Có thể nhập tay Bằng Chứng từ bảng bên phải.</p>
         </div>
         
         <div className="w-full max-w-md h-48 bg-black/30 border border-dashed border-[#2A363D] rounded-lg p-4 flex flex-col items-center justify-center text-[#86949B] text-sm text-center">
            {searching ? (
               <div className="flex flex-col items-center gap-2 text-[#45D6BF]">
                 <Loader2 className="animate-spin" size={32} />
                 <span>Đang quét cơ sở dữ liệu...</span>
               </div>
            ) : result ? (
               <div className="text-left w-full h-full text-[#E9EEE9] font-mono leading-relaxed">
                 <span className="text-[#F2B35D] font-bold">KẾT QUẢ TRẢ VỀ:</span><br/><br/>
                 {result}
               </div>
            ) : (
               <span>Nhập thông tin để bắt đầu quét.</span>
            )}
         </div>
      </div>
    </div>
  );
}
