import { BarChart, Users, CheckCircle, Smartphone } from "lucide-react";

export function Impact() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-8">
      <div className="mb-20 text-center border-b border-ink/10 pb-16">
        <div className="text-[10px] tracking-[0.4em] font-sans uppercase opacity-40 mb-6">Metrics & Outcomes</div>
        <h1 className="text-6xl md:text-7xl font-black font-serif tracking-tighter text-ink mb-8">Tác Động Thực Tế.</h1>
        <p className="font-sans text-xs tracking-widest uppercase opacity-60 leading-relaxed max-w-2xl mx-auto">
          Số liệu được tổng hợp ẩn danh từ những người dùng đã tham gia huấn luyện. Chúng tôi đo lường sự thay đổi hành vi thực sự.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 mb-20 border-t border-l border-ink/10">
        <div className="bg-transparent border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
          <div className="text-ink/30 mb-8"><Users className="w-6 h-6" strokeWidth={1.5} /></div>
          <div className="text-6xl font-black font-serif text-ink mb-4">1,248</div>
          <div className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-50">Người Luyện Tập</div>
        </div>
        <div className="bg-transparent border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
          <div className="text-ink/30 mb-8"><CheckCircle className="w-6 h-6" strokeWidth={1.5} /></div>
          <div className="text-6xl font-black font-serif text-ink mb-4">8,530</div>
          <div className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-50">Nhiệm Vụ Hoàn Thành</div>
        </div>
        <div className="bg-[#E5E3DF]/50 border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
          <div className="text-ink/50 mb-8"><BarChart className="w-6 h-6" strokeWidth={1.5} /></div>
          <div className="text-6xl font-black font-serif text-ink mb-4">+42%</div>
          <div className="text-[10px] tracking-[0.2em] uppercase font-sans font-bold opacity-80">Phản Xạ An Toàn</div>
        </div>
        <div className="bg-transparent border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
          <div className="text-ink/30 mb-8"><Smartphone className="w-6 h-6" strokeWidth={1.5} /></div>
          <div className="text-6xl font-black font-serif text-ink mb-4">315</div>
          <div className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-50">Dùng Easy Read</div>
        </div>
      </div>

      <div className="bg-transparent border border-ink/10 p-12 max-w-4xl mx-auto rounded-none relative">
        <div className="absolute top-12 left-12 right-12 bottom-12 bg-transparent border border-ink/5 pointer-events-none"></div>
        <div className="relative z-10 px-8 py-4">
          <h3 className="text-2xl font-serif italic text-ink mb-6">01. Phương Pháp Đo Lường</h3>
          <p className="text-sm font-sans leading-relaxed opacity-80 text-ink mb-8 max-w-2xl">
            Điểm cải thiện (+42%) được tính toán từ chênh lệch điểm số giữa bài kiểm tra đầu vào (Baseline) và bài kiểm tra sau khi hoàn thành ít nhất 2 nhiệm vụ huấn luyện. Chỉ những người dùng đồng ý chia sẻ dữ liệu ẩn danh mới được đưa vào báo cáo này.
          </p>
          <div className="border-t border-ink/10 pt-6">
            <div className="text-[10px] tracking-widest uppercase font-sans opacity-40">
              Note: Dữ liệu minh họa — không phải số liệu người dùng thật. (Trong bản phát hành, đây sẽ là dữ liệu Firebase).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
