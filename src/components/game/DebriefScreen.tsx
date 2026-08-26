import React from 'react';
import { GameState, GameAction } from '../../game/types';
import { calculateRunScore } from '../../game/scoring';
import { determineEnding as getEndingStr } from '../../game/endings';
import { Link } from 'react-router';

export function DebriefScreen({ state, dispatch }: { state: GameState, dispatch: React.Dispatch<GameAction> }) {
  const score = calculateRunScore(state);
  const ending = getEndingStr(state);

  return (
    <div className="fixed inset-0 z-50 bg-midnight text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-4xl md:text-6xl font-black font-serif tracking-tighter mb-4 text-safe">
        00:00 - HẾT NGÀY
      </h1>
      
      <div className="bg-deep-surface border border-white/10 rounded-2xl p-8 max-w-md w-full mb-8">
        <h2 className="text-xs uppercase tracking-widest font-bold opacity-60 mb-2">Kết quả đánh giá</h2>
        <div className="text-6xl font-bold font-serif mb-6">{score}/100</div>
        
        <div className="space-y-4 text-sm text-left">
          <div className="flex justify-between">
            <span className="opacity-70">Ví điện tử</span>
            <span className={state.walletShield > 50 ? 'text-safe' : 'text-danger'}>{state.walletShield}%</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Danh tính</span>
            <span className={state.identityShield > 50 ? 'text-safe' : 'text-danger'}>{state.identityShield}%</span>
          </div>
          <div className="flex justify-between">
            <span className="opacity-70">Gia đình</span>
            <span className={state.familyTrust > 50 ? 'text-safe' : 'text-danger'}>{state.familyTrust}%</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
        <button 
          onClick={() => dispatch({ type: 'RESET_RUN' })}
          className="flex-1 py-4 bg-white text-ink font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-surface-alt transition-colors"
        >
          Chơi lại
        </button>
        <Link 
          to="/forensics" 
          className="flex-1 py-4 border border-white/20 text-white font-bold text-xs uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors"
        >
          Phòng giám định
        </Link>
      </div>
    </div>
  );
}
