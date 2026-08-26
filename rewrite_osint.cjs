const fs = require('fs');
const content = `import React, { useState } from 'react';
import { CampaignState, GameAction } from '../../game/state/types';
import { Search } from 'lucide-react';

export function OsintView({ state, dispatch }: { state: CampaignState, dispatch: React.Dispatch<GameAction> }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<string | null>(null);
  
  const handleSearch = () => {
    if (!query) return;
    
    // Exact deterministic lookup in evidence
    const matchingEvidence = state.evidence.find(e => e.value.toLowerCase().includes(query.toLowerCase()) || e.label.toLowerCase().includes(query.toLowerCase()));
    
    if (matchingEvidence) {
      if (matchingEvidence.entityType === 'phone') {
        setResult(\`Phân tích [\${matchingEvidence.value}]: Cảnh báo! Số điện thoại này nằm trong danh sách đen, liên quan đến 2 vụ lừa đảo mạo danh ngân hàng trước đây.\`);
      } else if (matchingEvidence.entityType === 'domain') {
        setResult(\`Phân tích [\${matchingEvidence.value}]: Tên miền mới đăng ký cách đây 3 ngày. IP máy chủ đặt tại nước ngoài (không khớp với vị trí doanh nghiệp thật).\`);
      } else if (matchingEvidence.entityType === 'account') {
        setResult(\`Phân tích [\${matchingEvidence.value}]: Tài khoản ảo. Có lịch sử nhận và chuyển tiền liên tục đi nhiều tài khoản phụ trong thời gian ngắn.\`);
      } else {
        setResult(\`Phân tích [\${matchingEvidence.value}]: Thực thể này (\${matchingEvidence.entityType}) có dấu hiệu dị thường trên hệ thống mạng.\`);
      }
    } else {
      setResult(\`Không tìm thấy dữ liệu tình báo nào khớp với "\${query}". Hãy chắc chắn rằng bạn đã trích xuất bằng chứng này từ tín hiệu.\`);
    }
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
                 className="px-6 py-2 bg-[#45D6BF] text-[#080B0E] font-bold rounded hover:bg-[#6DA8FF] transition-colors"
               >
                 TRA CỨU
               </button>
            </div>
            <p className="text-[10px] text-[#86949B]">Mẹo: Nhập chính xác giá trị bằng chứng đã thu thập ở thẻ bên phải.</p>
         </div>
         
         <div className="w-full max-w-md h-48 bg-black/30 border border-dashed border-[#2A363D] rounded-lg p-4 flex flex-col items-center justify-center text-[#86949B] text-sm text-center">
            {result ? (
               <div className="text-left w-full h-full text-[#E9EEE9] font-mono leading-relaxed overflow-auto">
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
`;
fs.writeFileSync('src/components/desktop/OsintView.tsx', content);
