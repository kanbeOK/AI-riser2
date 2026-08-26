import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { GameState, GameAction } from '../../game/types';
import { CASES } from '../../game/content/cases';

export function CaseComplete({ state, dispatch }: { state: GameState, dispatch: React.Dispatch<GameAction> }) {
  const lastCaseId = state.completedCaseIds[state.completedCaseIds.length - 1];
  const caseDef = CASES.find(c => c.id === lastCaseId);

  const handleNext = () => {
    dispatch({ type: 'ADVANCE_TIME', payload: { minutes: 120 } }); // move forward 2 hours
    if (state.completedCaseIds.length >= 3) {
      dispatch({ type: 'END_RUN', payload: { endingId: 'tbd' } });
    } else {
      dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: 'next_case', safe: true, scoreDelta: 0, nextStatus: 'playing' } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full bg-deep-surface p-6 text-center text-white relative z-50">
      <div className="w-16 h-16 bg-safe/20 text-safe rounded-full flex items-center justify-center mb-6">
        <ShieldCheck className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-serif font-bold mb-2">Đã ngắt kết nối</h2>
      <p className="text-sm opacity-70 mb-8">{caseDef?.title}</p>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 w-full text-left mb-8 text-sm space-y-4">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Mục tiêu</h4>
          <p>{caseDef?.learningObjective}</p>
        </div>
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-50 mb-1">Cách xử lý an toàn</h4>
          <p className="text-safe font-bold">{caseDef?.safeVerificationInstructions}</p>
        </div>
      </div>

      <button 
        onClick={handleNext}
        className="w-full py-4 bg-white text-ink font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-alt transition-colors"
      >
        Tiếp tục 24H
      </button>
    </div>
  );
}
