import { useState } from "react";
import { ShieldAlert, Image as ImageIcon, Search } from "lucide-react";

export function Checker() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!text) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch("/api/check/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      setResult(data);
    } catch (e) {
      console.error(e);
      // Fallback
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-8">
      <div className="mb-16 border-b border-ink/10 pb-12">
        <div className="text-[10px] tracking-[0.4em] font-sans uppercase opacity-40 mb-6">Analysis Tool</div>
        <h1 className="text-5xl font-black font-serif tracking-tighter text-ink mb-6">Kiểm Tra Nhanh.</h1>
        <p className="font-sans text-xs tracking-widest uppercase opacity-60 leading-relaxed max-w-xl">
          Dán tin nhắn hoặc đường link vào đây để AI phân tích. <br/>
          <span className="text-danger italic opacity-80 font-serif lowercase tracking-normal text-sm">Lưu ý: Không gửi tên thật, số tài khoản, hoặc OTP.</span>
        </p>
      </div>

      <div className="bg-transparent border border-ink/10 p-8 mb-12 rounded-none">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Chèn văn bản cần kiểm tra tại đây..."
          className="w-full h-48 resize-none border-none focus:ring-0 p-0 text-ink placeholder-ink/30 bg-transparent font-serif text-lg leading-relaxed"
        />
        <div className="flex justify-between items-center pt-8 border-t border-ink/10 mt-4">
          <button className="flex items-center gap-3 text-[10px] tracking-widest uppercase font-bold text-ink/40 hover:text-ink transition-colors">
            <ImageIcon className="w-4 h-4" strokeWidth={1.5} /> Tải Ảnh (Max 5MB)
          </button>
          <button 
            onClick={handleAnalyze}
            disabled={!text || isAnalyzing}
            className="bg-ink text-paper px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-4 disabled:opacity-30 rounded-none hover:bg-ink/80 transition-colors"
          >
            {isAnalyzing ? "Đang Phân Tích..." : <>Phân Tích <span className="text-lg leading-none">&rarr;</span></>}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#E5E3DF]/30 border border-ink/10 p-12 rounded-none">
          <div className="flex items-center gap-8 mb-10 border-b border-ink/10 pb-10">
            <div className={`p-6 border ${result.riskLevel === 'high' || result.riskLevel === 'suspicious' ? 'border-danger text-danger' : 'border-ink text-ink'} bg-transparent rounded-none`}>
              <ShieldAlert className="w-8 h-8" strokeWidth={1} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] font-sans uppercase opacity-50 mb-2">Verdict / Risk: {result.riskLevel}</div>
              <h3 className="font-serif italic text-3xl text-ink leading-tight max-w-xl">{result.verdict}</h3>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] tracking-[0.3em] font-sans uppercase font-bold text-ink mb-6">Hành động khuyến nghị</h4>
              <ul className="space-y-4">
                {result.recommendedActions.map((act: string, i: number) => (
                  <li key={i} className="flex gap-4 text-sm text-ink items-start opacity-80 leading-relaxed">
                    <span className="font-serif italic text-ink opacity-40">0{i+1}.</span> {act}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-[10px] tracking-widest uppercase text-ink/40 font-sans mt-12 border-t border-ink/10 pt-8">
              Disclaimer: {result.disclaimer}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
