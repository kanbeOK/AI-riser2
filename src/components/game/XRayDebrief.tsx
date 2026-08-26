import React from 'react';
import { GameState } from '../../game/types';
import { CASES } from '../../game/content/cases';

export function XRayDebrief({ state, dispatch }: { state: GameState, dispatch: any }) {
  // Only calculate score for completed cases
  const totalScore = state.completedCaseIds.length * 1000 + state.walletShield * 10 + state.identityShield * 10 + state.familyTrust * 10;
  
  return (
    <div className="min-h-screen bg-[#071018] text-white p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-black font-serif mb-2">Hồ Sơ Giám Định</h1>
        <p className="text-gray-400 uppercase tracking-widest text-sm mb-12">Phân tích hành vi & Kết quả sinh tồn</p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 md:col-span-1">
            <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Điểm tổng kết</div>
            <div className="text-4xl font-bold font-mono text-green-400">{totalScore.toLocaleString()}</div>
          </div>
          <div className="p-6 bg-white/5 rounded-2xl border border-white/10 md:col-span-3 grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Ví</div>
              <div className={`text-2xl font-bold ${state.walletShield < 50 ? 'text-red-500' : 'text-white'}`}>{state.walletShield}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Danh tính</div>
              <div className={`text-2xl font-bold ${state.identityShield < 50 ? 'text-red-500' : 'text-white'}`}>{state.identityShield}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Gia đình</div>
              <div className={`text-2xl font-bold ${state.familyTrust < 50 ? 'text-red-500' : 'text-white'}`}>{state.familyTrust}%</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-8">
          {state.completedCaseIds.map(caseId => {
            const c = CASES[caseId];
            if (!c) return null;
            const caseDecisions = state.decisions.filter(d => d.caseId === caseId);
            const unsafeCount = caseDecisions.filter(d => !d.safe).length;
            
            return (
              <div key={caseId} className="p-6 bg-[#0D1922] rounded-2xl border border-white/10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="text-xs text-blue-400 font-mono mb-1">{c.startTime}</div>
                    <h3 className="text-2xl font-bold font-serif">{c.title}</h3>
                  </div>
                  <div className={`px-3 py-1 rounded text-xs font-bold uppercase ${unsafeCount === 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                    {unsafeCount === 0 ? 'An toàn' : 'Có rủi ro'}
                  </div>
                </div>
                
                <div className="space-y-4 mb-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-px before:bg-white/10">
                  {caseDecisions.map(d => {
                    const action = c.scenes[d.sceneId]?.actions.find(a => a.id === d.actionId);
                    return (
                      <div key={d.id} className="relative pl-8">
                        <div className={`absolute left-2 top-2 w-1.5 h-1.5 rounded-full ${d.safe ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <div className="text-xs text-gray-500 font-mono mb-0.5">{d.timestamp}</div>
                        <div className={`text-sm ${d.safe ? 'text-gray-300' : 'text-red-400'}`}>
                          Quyết định: {action ? action.label : d.actionId}
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Thủ đoạn thao túng đã sử dụng</div>
                  <div className="flex gap-2 flex-wrap mb-6">
                    {c.tactics.map(t => (
                      <span key={t} className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300 border border-white/10">{t}</span>
                    ))}
                  </div>
                  
                  <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Nguồn kiểm chứng chính thức</div>
                  <a href={c.source.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-white/5 hover:bg-white/10 transition-colors border border-white/10 rounded-xl">
                    <div className="font-bold text-sm text-blue-400 mb-1">{c.source.title}</div>
                    <div className="text-xs text-gray-400">{c.source.publisher}</div>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => dispatch({ type: 'RESET_RUN' })}
            className="px-8 py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-gray-200 transition-colors"
          >
            Chơi lại
          </button>
          <a href="/" className="px-8 py-4 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors">
            Về trang chủ
          </a>
        </div>
      </div>
    </div>
  );
}
