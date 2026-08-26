import { useState, useEffect } from "react";
import { BarChart, CheckCircle, Smartphone } from "lucide-react";

export function Impact() {
  const [history, setHistory] = useState<any[]>([]);
  
  useEffect(() => {
    try {
      const data = JSON.parse(localStorage.getItem('phanh_history') || '[]');
      setHistory(data);
    } catch(e) {
      setHistory([]);
    }
  }, []);

  const totalMissions = history.length;
  let improvement: number | null = null;

  if (totalMissions >= 2) {
    const baseline = history[0].score;
    const latest = history[history.length - 1].score;
    if (baseline > 0) {
      improvement = Math.round(((latest - baseline) / baseline) * 100);
    } else if (latest > 0) {
      improvement = 100; // From 0 to something
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-20 px-8 min-h-[calc(100vh-100px)]">
      <div className="mb-20 text-center border-b border-ink/10 pb-16">
        <div className="text-[10px] tracking-[0.4em] font-sans uppercase opacity-40 mb-6">Your Progress</div>
        <h1 className="text-6xl md:text-7xl font-black font-serif tracking-tighter text-ink mb-8">Tiến Bộ Của Bạn.</h1>
        <p className="font-sans text-xs tracking-widest uppercase opacity-60 leading-relaxed max-w-2xl mx-auto">
          Dữ liệu tiến trình được lưu trữ an toàn trên thiết bị của bạn. Hoàn thành nhiều nhiệm vụ để theo dõi sự cải thiện phản xạ bảo mật.
        </p>
      </div>

      {totalMissions === 0 ? (
        <div className="text-center py-20 border border-ink/10 bg-paper/50 mb-20">
          <p className="text-ink font-serif italic text-xl mb-4">Chưa có đủ dữ liệu thật để công bố mức cải thiện.</p>
          <p className="text-ink/60 text-sm uppercase tracking-widest">Hoàn thành bài đầu vào và bài sau luyện tập để xem tiến bộ của chính bạn.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 mb-20 border-t border-l border-ink/10">
          <div className="bg-transparent border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
            <div className="text-ink/30 mb-8"><CheckCircle className="w-6 h-6" strokeWidth={1.5} /></div>
            <div className="text-6xl font-black font-serif text-ink mb-4">{totalMissions}</div>
            <div className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-50">Nhiệm Vụ Đã Thử</div>
          </div>

          <div className="bg-[#E5E3DF]/50 border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
            <div className="text-ink/50 mb-8"><BarChart className="w-6 h-6" strokeWidth={1.5} /></div>
            <div className="text-6xl font-black font-serif text-ink mb-4">
              {improvement !== null ? `${improvement > 0 ? '+' : ''}${improvement}%` : '---'}
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase font-sans font-bold opacity-80">Cải Thiện Phản Xạ</div>
          </div>

          <div className="bg-transparent border-r border-b border-ink/10 p-12 flex flex-col items-center text-center">
            <div className="text-ink/30 mb-8"><Smartphone className="w-6 h-6" strokeWidth={1.5} /></div>
            <div className="text-6xl font-black font-serif text-ink mb-4">
              {history[history.length - 1].score}
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-50">Điểm Gần Nhất</div>
          </div>
        </div>
      )}

      <div className="bg-transparent border border-ink/10 p-12 max-w-4xl mx-auto rounded-none relative">
        <div className="absolute top-12 left-12 right-12 bottom-12 bg-transparent border border-ink/5 pointer-events-none"></div>
        <div className="relative z-10 px-8 py-4">
          <h3 className="text-2xl font-serif italic text-ink mb-6">01. Phương Pháp Đo Lường Reflex Score</h3>
          <p className="text-sm font-sans leading-relaxed opacity-80 text-ink mb-8 max-w-2xl">
            Điểm cải thiện được tính toán từ chênh lệch điểm số giữa bài kiểm tra đầu tiên (Baseline) và bài kiểm tra gần nhất trong cùng một phiên. Dữ liệu chỉ lưu cục bộ trên máy bạn.
          </p>
          <div className="border-t border-ink/10 pt-6">
            <div className="text-[10px] tracking-widest uppercase font-sans opacity-40">
              Điểm số cao trong giả lập không đảm bảo 100% an toàn ngoài đời thực. Hãy luôn duy trì thói quen kiểm tra độc lập (Zero Trust).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
