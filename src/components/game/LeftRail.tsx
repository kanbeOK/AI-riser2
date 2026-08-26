import React from 'react';
import { GameState } from '../../game/types';
import { CASE_ORDER, CASES } from '../../game/content/cases';

export function LeftRail({ state }: { state: GameState }) {
  return (
    <div className="flex flex-col h-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black font-serif tracking-tighter">PHANH!</h1>
        <div className="text-sm font-mono text-gray-400 tracking-widest mt-1 uppercase">24H Survival</div>
      </div>
      
      <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/10">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Thời gian mô phỏng</div>
        <div className="text-4xl font-bold font-mono text-red-500">{state.currentTime}</div>
        <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 transition-all duration-1000" style={{ width: `${state.dayProgress * 100}%` }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Dòng thời gian</div>
        <div className="space-y-4 relative before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-white/10">
          {CASE_ORDER.map(caseId => {
            const isCompleted = state.completedCaseIds.includes(caseId);
            const isCurrent = state.currentCaseId === caseId;
            const c = CASES[caseId];
            
            return (
              <div key={caseId} className={`relative pl-8 ${isCompleted ? 'opacity-50' : (isCurrent ? 'opacity-100' : 'opacity-30')}`}>
                <div className={`absolute left-1.5 top-1.5 w-2 h-2 rounded-full ${isCurrent ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : (isCompleted ? 'bg-gray-500' : 'bg-gray-700')}`}></div>
                <div className="text-xs font-mono text-gray-400">{c.startTime}</div>
                <div className={`text-sm font-bold ${isCurrent ? 'text-white' : 'text-gray-300'}`}>{c.title}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="mt-8 pt-6 border-t border-white/10 flex gap-4">
        <button className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Tạm dừng</button>
        <button className="text-xs uppercase tracking-widest text-gray-500 hover:text-white transition-colors">Âm thanh</button>
      </div>
    </div>
  );
}
