import { useState } from "react";
import { ShieldAlert, AlertTriangle, Link as LinkIcon, AlertCircle, RefreshCw } from "lucide-react";
import { RiskLevel, ConfidenceBand } from "../shared/types";

interface CheckerResult {
  riskLevel: RiskLevel;
  confidenceBand: ConfidenceBand;
  verdict: string;
  observableCues: Array<{
    label: string;
    evidenceSnippet: string;
    explanation: string;
  }>;
  extractedBrowserUrls: string[];
  urlReputation: Array<{
    url: string;
    status: string;
  }>;
  unknowns: string[];
  recommendedActions: string[];
  disclaimer: string;
  analysisSource: string;
}

export function Checker() {
  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<CheckerResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch("/api/check/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error?.message || "Lỗi khi phân tích. Vui lòng thử lại sau.");
      }
      
      setResult(data);
    } catch (e: any) {
      console.error(e);
      setError(e.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-4xl mx-auto py-20 px-8 min-h-[calc(100vh-100px)]">
      <div className="mb-16 border-b border-ink/10 pb-12">
        <div className="text-[10px] tracking-[0.4em] font-sans uppercase opacity-40 mb-6">Công Cụ Phân Tích</div>
        <h1 className="text-5xl font-black font-serif tracking-tighter text-ink mb-6">Kiểm Tra Nhanh.</h1>
        <p className="font-sans text-xs tracking-widest uppercase opacity-60 leading-relaxed max-w-xl">
          Dán tin nhắn nghi ngờ vào đây để AI phân tích.
          <br/>
          <span className="text-danger italic opacity-80 font-serif lowercase tracking-normal text-sm">Lưu ý: Bạn phải tự xóa các thông tin như tên thật, số tài khoản, mã OTP trước khi phân tích.</span>
        </p>
      </div>

      <div className="bg-transparent border border-ink/10 p-8 mb-12 rounded-none">
        <label htmlFor="checker-input" className="sr-only">Nội dung tin nhắn cần kiểm tra</label>
        <textarea
          id="checker-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Chèn văn bản cần kiểm tra tại đây..."
          disabled={isAnalyzing || result !== null}
          className="w-full h-48 resize-none border-none focus:ring-0 p-0 text-ink placeholder-ink/30 bg-transparent font-serif text-lg leading-relaxed disabled:opacity-50"
        />
        <div className="flex justify-between items-center pt-8 border-t border-ink/10 mt-4">
          <div className="text-[10px] uppercase tracking-widest font-bold text-ink/40">
            {text.length}/5000 ký tự
          </div>
          <div className="flex gap-4">
            {result && (
              <button 
                onClick={handleReset}
                className="bg-transparent border border-ink text-ink px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2 rounded-none hover:bg-ink/5 transition-colors"
              >
                <RefreshCw className="w-3 h-3" /> Kiểm tra văn bản khác
              </button>
            )}
            <button 
              onClick={handleAnalyze}
              disabled={!text.trim() || isAnalyzing || text.length > 5000 || result !== null}
              className="bg-ink text-paper px-10 py-4 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-4 disabled:opacity-30 rounded-none hover:bg-ink/80 transition-colors"
            >
              {isAnalyzing ? "Đang Phân Tích..." : <>Phân Tích <span className="text-lg leading-none">&rarr;</span></>}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="animate-in fade-in p-6 bg-danger/10 border border-danger/20 text-danger text-sm flex items-start gap-4 mb-8">
           <AlertTriangle className="w-5 h-5 shrink-0" />
           <div>{error}</div>
        </div>
      )}

      {result && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 bg-[#E5E3DF]/30 border border-ink/10 p-12 rounded-none">
          <div className="flex items-center gap-8 mb-10 border-b border-ink/10 pb-10">
            <div className={`p-6 border ${result.riskLevel === 'high' || result.riskLevel === 'suspicious' ? 'border-danger text-danger bg-danger/5' : 'border-ink text-ink'} rounded-none`}>
              <ShieldAlert className="w-8 h-8" strokeWidth={1.5} />
            </div>
            <div>
              <div className="text-[10px] tracking-[0.3em] font-sans uppercase opacity-50 mb-2">Mức độ rủi ro: {result.riskLevel}</div>
              <h3 className="font-serif italic text-3xl text-ink leading-tight max-w-2xl">{result.verdict}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-8">
              {result.observableCues && result.observableCues.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-sans uppercase font-bold text-danger mb-6 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Dấu Hiệu Đáng Ngờ
                  </h4>
                  <ul className="space-y-6">
                    {result.observableCues.map((cue, i) => (
                      <li key={i} className="flex flex-col gap-2 text-sm text-ink items-start leading-relaxed border-l-2 border-danger/20 pl-4">
                        <strong className="font-bold">{cue.label}</strong>
                        {cue.evidenceSnippet && <span className="italic opacity-70 bg-ink/5 p-2 text-xs">"{cue.evidenceSnippet}"</span>}
                        <span>{cue.explanation}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.unknowns && result.unknowns.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-sans uppercase font-bold text-ink/70 mb-4 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Thông tin chưa rõ
                  </h4>
                  <ul className="space-y-2">
                    {result.unknowns.map((unk, i) => (
                      <li key={i} className="text-sm opacity-80 list-disc ml-5">{unk}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-8">
              {result.urlReputation && result.urlReputation.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-sans uppercase font-bold text-ink mb-6 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" /> Đường Link Đã Quét
                  </h4>
                  <ul className="space-y-3">
                    {result.urlReputation.map((urlInfo, i) => (
                      <li key={i} className="text-sm border border-ink/10 p-3 bg-white/50">
                        <div className="break-all font-mono text-xs mb-2 opacity-80">{urlInfo.url}</div>
                        <div className="text-[10px] uppercase tracking-widest font-bold text-ink/60">
                           Tình trạng: {urlInfo.status === 'not_checked' ? "Chưa kiểm tra danh tiếng đường dẫn" : urlInfo.status}
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.recommendedActions && result.recommendedActions.length > 0 && (
                <div>
                  <h4 className="text-[10px] tracking-[0.3em] font-sans uppercase font-bold text-ink mb-6">Hành động khuyến nghị</h4>
                  <ul className="space-y-4">
                    {result.recommendedActions.map((act, i) => (
                      <li key={i} className="flex gap-4 text-sm text-ink items-start opacity-90 leading-relaxed">
                        <span className="font-serif italic text-ink opacity-40 font-bold">0{i+1}.</span> {act}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="text-[10px] tracking-widest uppercase text-ink/40 font-sans mt-12 border-t border-ink/10 pt-8 flex flex-col gap-2">
            <div>Độ tin cậy: {result.confidenceBand}</div>
            <div>Nguồn phân tích: {result.analysisSource}</div>
            <div className="mt-2 text-ink/60">Khuyến cáo: {result.disclaimer}</div>
          </div>
        </div>
      )}
    </div>
  );
}
