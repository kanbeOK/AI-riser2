import { useState } from "react";
import { useParams, Link } from "react-router";
import { SEED_SCENARIOS } from "../data/scenarios";
import { ShieldAlert, AlertTriangle, CheckCircle, Smartphone, ArrowRight, CornerDownRight } from "lucide-react";

type Turn = {
  id: string;
  sender: string;
  text: string;
  isUser: boolean;
};

export function MissionPlay() {
  const { scenarioId } = useParams();
  const scenario = SEED_SCENARIOS.find(s => s.id === scenarioId);
  const [turns, setTurns] = useState<Turn[]>(
    scenario ? [{ id: "0", sender: scenario.initialMessage.sender, text: scenario.initialMessage.text, isUser: false }] : []
  );
  
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  if (!scenario) return <div className="p-8 text-center">Không tìm thấy kịch bản</div>;

  const handleAction = (kind: string) => {
    // For deterministic Phase 1: Any "safe" action ends well.
    if (kind === "verify" || kind === "block" || kind === "report") {
      setTurns(prev => [...prev, { id: Date.now().toString(), sender: "Bạn", text: "Tôi sẽ tự kiểm tra lại. Cúp máy/Chặn.", isUser: true }]);
      setScore(100);
      setIsFinished(true);
    } else if (kind === "reply") {
       setTurns(prev => [...prev, { id: Date.now().toString(), sender: "Bạn", text: "Được rồi, tôi làm theo.", isUser: true }]);
       setScore(20);
       setIsFinished(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col min-h-[calc(100vh-100px)] bg-paper border-l border-r border-ink/10">
      {/* Mission Header */}
      <div className="bg-paper px-8 py-6 border-b border-ink/10 flex justify-between items-center z-10">
        <div>
          <h2 className="font-serif italic text-2xl text-ink">{scenario.title}</h2>
          <div className="text-[9px] tracking-[0.3em] font-sans uppercase opacity-40 mt-2">Channel: {scenario.initialMessage.channel}</div>
        </div>
        <button 
          onClick={() => handleAction("verify")}
          className="border border-ink text-ink px-4 py-2 text-[10px] uppercase tracking-widest font-bold hover:bg-ink hover:text-paper transition-colors rounded-none flex items-center gap-2"
        >
          <ShieldAlert className="w-4 h-4" strokeWidth={1.5} /> PHANH!
        </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 p-8 overflow-y-auto space-y-8 bg-[#FAF9F6] relative">
        {turns.map(turn => (
          <div key={turn.id} className={`flex flex-col ${turn.isUser ? "items-end" : "items-start"}`}>
            <div className={`text-[9px] tracking-widest uppercase opacity-40 mb-2 ${turn.isUser ? "pr-2" : "pl-2"}`}>
              {turn.sender}
            </div>
            <div className={`px-6 py-5 max-w-[85%] text-sm leading-relaxed rounded-none ${
              turn.isUser 
                ? "bg-ink text-paper" 
                : "bg-transparent border border-ink/10 text-ink"
            }`}>
              {turn.text}
            </div>
          </div>
        ))}
      </div>

      {/* Controls / Debrief */}
      <div className="bg-paper p-8 border-t border-ink/10">
        {!isFinished ? (
          <div className="grid grid-cols-2 gap-4">
            <button onClick={() => handleAction("reply")} className="bg-transparent border border-ink/10 hover:bg-ink/5 text-ink py-4 text-[10px] uppercase tracking-widest font-bold transition-colors rounded-none">
              Tin tưởng & Trả lời
            </button>
            <button onClick={() => handleAction("verify")} className="bg-transparent border border-ink hover:bg-ink hover:text-paper text-ink py-4 text-[10px] uppercase tracking-widest font-bold transition-colors rounded-none">
              Xác minh độc lập
            </button>
            <button onClick={() => handleAction("consult")} className="bg-transparent border border-ink/10 hover:bg-ink/5 text-ink py-4 text-[10px] uppercase tracking-widest font-bold transition-colors rounded-none">
              Hỏi người thân
            </button>
            <button onClick={() => handleAction("block")} className="bg-transparent border border-danger/40 hover:bg-danger/10 text-danger py-4 text-[10px] uppercase tracking-widest font-bold transition-colors rounded-none">
              Chặn & Báo cáo
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-6 mb-10 border-b border-ink/10 pb-8">
              <div className="w-20 h-20 border border-ink flex items-center justify-center bg-transparent text-ink font-serif font-black text-4xl rounded-none">
                {score}
              </div>
              <div>
                <h3 className="font-serif italic text-3xl text-ink mb-2">X-Quang Thao Túng.</h3>
                <p className="text-[10px] tracking-[0.2em] uppercase font-sans opacity-50">Phân tích điểm mù bảo mật</p>
              </div>
            </div>

            <div className="border border-danger/20 bg-danger/5 p-8 mb-6 rounded-none">
              <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-danger flex items-center gap-3 mb-6">
                <AlertTriangle className="w-4 h-4" strokeWidth={1.5} /> Dấu Hiệu Lừa Đảo
              </h4>
              <ul className="space-y-4">
                {scenario.groundTruth.cues.map((cue, i) => (
                  <li key={i} className="flex gap-4 text-sm text-ink items-start leading-relaxed">
                    <span className="text-danger font-serif italic mt-0.5">0{i+1}.</span> {cue}
                  </li>
                ))}
              </ul>
            </div>

            <div className="border border-ink/20 bg-ink/5 p-8 mb-10 rounded-none">
              <h4 className="font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-ink flex items-center gap-3 mb-4">
                <CheckCircle className="w-4 h-4" strokeWidth={1.5} /> Cách Xử Lý An Toàn
              </h4>
              <p className="text-sm text-ink leading-relaxed mb-6 opacity-80">{scenario.debrief.saferPath}</p>
              <div className="bg-transparent border-t border-ink/10 pt-6 text-sm font-serif italic flex gap-4 text-ink">
                 <CornerDownRight className="w-4 h-4 opacity-40 mt-1 shrink-0" strokeWidth={1.5} />
                 <span>"{scenario.debrief.actionScript}"</span>
              </div>
            </div>

            <Link to="/missions" className="w-full flex justify-between items-center bg-ink text-paper px-8 py-5 text-[10px] uppercase tracking-[0.2em] font-bold hover:bg-ink/80 transition-colors rounded-none">
              <span>Thử nhiệm vụ khác</span>
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
