import { Link } from "react-router";
import { SEED_SCENARIOS } from "../data/scenarios";
import { Play, ShieldAlert } from "lucide-react";

export function Missions() {
  return (
    <div className="max-w-5xl mx-auto py-20 px-8">
      <div className="mb-16 border-b border-ink/10 pb-12">
        <div className="text-[10px] tracking-[0.4em] font-sans uppercase opacity-40 mb-6">Archive</div>
        <h1 className="text-5xl font-black font-serif tracking-tighter text-ink mb-6">Thư Viện Nhiệm Vụ.</h1>
        <p className="font-sans text-xs tracking-widest uppercase opacity-60 leading-relaxed max-w-xl">Chọn một nhiệm vụ để luyện tập phản xạ. Các kịch bản được thiết kế an toàn, không yêu cầu thông tin thật.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-t border-l border-ink/10">
        {SEED_SCENARIOS.map((scenario, index) => (
          <div key={scenario.id} className="bg-transparent border-r border-b border-ink/10 p-10 flex flex-col group hover:bg-ink/5 transition-colors rounded-none">
            <div className="flex items-start justify-between mb-12">
              <div className="text-[10px] tracking-[0.2em] font-sans uppercase opacity-40">
                NO. {String(index + 1).padStart(2, '0')}
              </div>
              <div className="flex gap-1">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-none ${i < scenario.difficulty ? 'bg-ink' : 'bg-ink/10'}`} />
                ))}
              </div>
            </div>
            
            <h2 className="text-3xl font-serif italic text-ink mb-6">{scenario.title}</h2>
            <p className="font-sans text-xs leading-relaxed opacity-70 mb-12 flex-1 max-w-sm">{scenario.learningObjective}</p>
            
            <Link
              to={`/mission/${scenario.id}`}
              className="flex items-center justify-between w-full border-t border-ink/10 pt-6 font-sans text-[10px] tracking-[0.2em] uppercase font-bold text-ink group-hover:opacity-100 opacity-60 transition-opacity"
            >
              <span>Vào nhiệm vụ</span>
              <span className="text-lg leading-none">&rarr;</span>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
