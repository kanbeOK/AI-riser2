import { useState, useEffect } from "react";
import { useParams, Link } from "react-router";
import { SEED_SCENARIOS } from "../data/scenarios";
import { ShieldAlert, AlertTriangle, CheckCircle, Info, CornerDownRight, Loader2 } from "lucide-react";
import { MissionTurn, MissionResult } from "../shared/types";

export function MissionPlay() {
  const { scenarioId } = useParams();
  const scenario = SEED_SCENARIOS.find(s => s.id === scenarioId);
  const [turns, setTurns] = useState<MissionTurn[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [result, setResult] = useState<MissionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEasyRead, setIsEasyRead] = useState(false);

  useEffect(() => {
    setIsEasyRead(localStorage.getItem("phanh_easy_read") === "true");
    if (scenario) {
      setTurns([{ 
        id: "turn-0", 
        type: 'scenario', 
        message: scenario.initialMessage 
      }]);
    }
  }, [scenario]);

  if (!scenario) return <div className="p-8 text-center text-ink">Không tìm thấy kịch bản</div>;

  const handleAction = async (actionKind: string) => {
    if (isLoading || isFinished) return;

    let userText = "";
    if (actionKind === "verify") userText = "Tôi cần xác minh lại thông tin này.";
    else if (actionKind === "reply") userText = "Tôi hiểu rồi, tôi sẽ làm theo.";
    else if (actionKind === "consult") userText = "Để tôi hỏi người thân xem sao.";
    else if (actionKind === "block_report") userText = "Tôi không tin, chặn liên lạc.";

    const newTurn: MissionTurn = {
      id: Date.now().toString(),
      type: 'user',
      message: userText,
      actionKind: actionKind as any
    };

    const nextTurns = [...turns, newTurn];
    setTurns(nextTurns);

    if (actionKind === "block_report" || actionKind === "verify") {
      finishMission(nextTurns, actionKind);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const history = turns.map(t => ({
        role: t.type === 'user' ? 'user' : 'model',
        parts: [{ text: t.message }]
      }));

      const res = await fetch('/api/scenarios/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenarioId: scenario.id,
          userAction: actionKind,
          userMessage: userText,
          history
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Lỗi kết nối");

      setTurns(prev => [...prev, {
        id: Date.now().toString() + "-ai",
        type: 'scenario',
        message: data.message,
        isGeminiAdapted: data.source === 'gemini'
      }]);

      if (actionKind === 'consult') {
        if (nextTurns.filter(t => t.type === 'user' && t.actionKind === 'consult').length >= 1) {
           setTimeout(() => finishMission(nextTurns, 'consult'), 2000);
        }
      } else if (nextTurns.length >= 7) {
        finishMission(nextTurns, 'reply');
      }
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const finishMission = (finalTurns: MissionTurn[], finalAction: string) => {
    let score = 20;
    if (finalAction === "block_report" || finalAction === "verify") score = 100;
    else if (finalAction === "consult") score = 80;

    const reflexScoreBreakdown = {
      safeActionQuality: score === 100 ? 50 : score === 80 ? 40 : 10,
      cueRecognition: score === 100 ? 30 : 10,
      responseSequence: score === 100 ? 20 : 0,
      total: score
    };

    setResult({
      completed: true,
      score,
      reflexScoreBreakdown
    });
    
    try {
      const history = JSON.parse(localStorage.getItem('phanh_history') || '[]');
      history.push({
        scenarioId: scenario.id,
        score,
        date: new Date().toISOString()
      });
      localStorage.setItem('phanh_history', JSON.stringify(history));
    } catch(e) {}
    
    setIsFinished(true);
  };

  const typography = isEasyRead ? "text-base font-sans" : "text-sm font-sans";

  return (
    <div className={`max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-100px)] bg-paper border-l border-r border-ink/10 ${isEasyRead ? '*:transition-none' : ''}`}>
      <div className="bg-paper px-8 py-6 border-b border-ink/10 flex justify-between items-center z-10 sticky top-0">
        <div>
          <h2 className="font-serif italic text-2xl text-ink">{scenario.title}</h2>
          <div className="text-[10px] tracking-[0.2em] font-sans uppercase opacity-60 mt-2 flex items-center gap-2">
             Mô Phỏng 
             {isEasyRead && <span className="bg-ink text-paper px-2 py-0.5 rounded-none text-[8px]">EASY READ</span>}
          </div>
        </div>
        <div className="border border-ink text-ink px-4 py-2 text-[10px] uppercase tracking-widest font-bold flex items-center gap-2 bg-paper">
          <ShieldAlert className="w-4 h-4" strokeWidth={1.5} /> PHANH!
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-[#FAF9F6] relative">
        {turns.map(turn => (
          <div key={turn.id} className={`flex flex-col \${turn.type === 'user' ? "items-end" : "items-start"}`}>
            <div className={`text-[10px] font-bold tracking-widest uppercase opacity-60 mb-2 \${turn.type === 'user' ? "pr-2" : "pl-2"} flex items-center gap-2`}>
              {turn.type === 'user' ? "Bạn" : "Đối tượng"}
              {turn.isGeminiAdapted && <span className="bg-ink/10 text-ink px-1.5 py-0.5 text-[8px] rounded-none">AI Phản hồi</span>}
            </div>
            <div className={`px-6 py-5 max-w-[85%] \${typography} leading-relaxed rounded-none \${
              turn.type === 'user'
                 ? "bg-ink text-paper" 
                 : "bg-transparent border border-ink/10 text-ink shadow-sm"
            }`}>
              {turn.message}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex flex-col items-start">
             <div className="px-6 py-5 bg-transparent border border-ink/10 text-ink shadow-sm flex items-center gap-2">
               <Loader2 className="w-4 h-4 animate-spin opacity-50" />
               <span className="text-xs opacity-50 uppercase tracking-widest">Đang phản hồi...</span>
             </div>
          </div>
        )}
        {error && (
          <div className="text-danger text-sm p-4 bg-danger/10 border border-danger/20 text-center">
            {error}
          </div>
        )}
      </div>

      <div className="bg-paper p-8 border-t border-ink/10">
        {!isFinished ? (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAction("reply")} disabled={isLoading} className="bg-transparent border border-ink/20 hover:bg-ink/5 text-ink py-4 text-[11px] uppercase tracking-widest font-bold transition-colors rounded-none disabled:opacity-50">
              Trả lời
            </button>
            <button onClick={() => handleAction("consult")} disabled={isLoading} className="bg-transparent border border-ink/20 hover:bg-ink/5 text-ink py-4 text-[11px] uppercase tracking-widest font-bold transition-colors rounded-none disabled:opacity-50">
              Hỏi người thân
            </button>
            <button onClick={() => handleAction("verify")} disabled={isLoading} className="bg-transparent border border-ink hover:bg-ink hover:text-paper text-ink py-4 text-[11px] uppercase tracking-widest font-bold transition-colors rounded-none disabled:opacity-50">
              Xác minh
            </button>
            <button onClick={() => handleAction("block_report")} disabled={isLoading} className="bg-transparent border border-danger/40 hover:bg-danger/10 text-danger py-4 text-[11px] uppercase tracking-widest font-bold transition-colors rounded-none disabled:opacity-50">
              Chặn / Dừng
            </button>
          </div>
        ) : result ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6 mb-10 border-b border-ink/10 pb-8">
              <div className="w-24 h-24 border border-ink flex flex-col items-center justify-center bg-transparent text-ink rounded-none">
                <span className="font-serif font-black text-4xl leading-none">{result.score}</span>
                <span className="text-[8px] uppercase tracking-widest mt-1">Điểm</span>
              </div>
              <div>
                <h3 className="font-serif italic text-3xl text-ink mb-2">X-Quang Thao Túng.</h3>
                <p className="text-[11px] tracking-[0.2em] uppercase font-sans opacity-60">Phân tích điểm mù bảo mật</p>
              </div>
            </div>

            <div className="border border-danger/20 bg-danger/5 p-8 mb-6 rounded-none">
              <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-danger flex items-center gap-3 mb-6">
                <AlertTriangle className="w-4 h-4" strokeWidth={1.5} /> Dấu Hiệu Lừa Đảo
              </h4>
              <ul className="space-y-4">
                {scenario.observableCues.map((cue, i) => (
                  <li key={i} className="flex gap-4 text-sm text-ink items-start leading-relaxed">
                    <span className="text-danger font-serif italic mt-0.5 font-bold">0{i+1}.</span> {cue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ink/20 bg-ink/5 p-8 mb-6 rounded-none">
              <h4 className="font-sans text-[11px] tracking-[0.2em] uppercase font-bold text-ink flex items-center gap-3 mb-4">
                <CheckCircle className="w-4 h-4" strokeWidth={1.5} /> Hướng Dẫn An Toàn
              </h4>
              <p className="text-sm text-ink leading-relaxed mb-6 opacity-80">{scenario.safeVerificationInstructions}</p>
              <div className="bg-transparent border-t border-ink/10 pt-6 text-sm font-serif italic flex gap-4 text-ink">
                 <CornerDownRight className="w-4 h-4 opacity-40 mt-1 shrink-0" strokeWidth={1.5} />
                 <span>"{scenario.safeResponseScript}"</span>
              </div>
            </div>

            <div className="border border-ink/10 bg-transparent p-6 mb-10 rounded-none text-xs text-ink/70">
              <div className="flex items-center gap-2 mb-2 font-bold uppercase tracking-widest text-[10px]">
                <Info className="w-3 h-3" /> Nguồn cảnh báo chính thức
              </div>
              <a href={scenario.officialSource.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                {scenario.officialSource.title} - {scenario.officialSource.publisher} ({scenario.officialSource.publicationDate})
              </a>
            </div>

            <Link to="/missions" className="w-full flex justify-between items-center bg-ink text-paper px-8 py-5 text-[11px] uppercase tracking-[0.2em] font-bold hover:bg-ink/80 transition-colors rounded-none">
              <span>Thử nhiệm vụ khác</span>
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
