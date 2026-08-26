import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useGameSession } from '../../game/useGameSession';
import { PhoneShell } from './PhoneShell';
import { LeftRail } from './LeftRail';
import { RightRail } from './RightRail';
import { CASES, CASE_ORDER } from '../../game/content/cases';
import { SceneRenderer } from './SceneRenderer';
import { XRayDebrief } from './XRayDebrief';
import { ColdOpen } from './ColdOpen';

export function GameShell() {
  const { state, dispatch, reset } = useGameSession();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDemo = searchParams.get('demo') === 'true';
  const mode = searchParams.get('mode') || (isDemo ? 'demo' : 'solo');

  useEffect(() => {
    if (state.status === 'intro') {
      dispatch({ type: 'START_RUN', payload: { mode: mode as any, difficulty: 'normal', seed: isDemo ? 'demo-seed-123' : undefined } });
    }
  }, [state.status, dispatch, mode, isDemo]);

  useEffect(() => {
    if (state.status === 'playing' && !state.currentCaseId) {
      // Find the first uncompleted case based on CASE_ORDER
      const nextCaseId = CASE_ORDER.find(id => !state.completedCaseIds.includes(id));
      if (nextCaseId) {
        const nextCase = CASES[nextCaseId];
        dispatch({ 
           type: 'RECEIVE_EVENT', 
           payload: { 
             caseId: nextCase.id, 
             sceneId: nextCase.initialSceneId, 
             channel: nextCase.scenes[nextCase.initialSceneId].channel,
           } 
         });
      } else {
        dispatch({ type: 'END_RUN', payload: { endingId: 'e_survivor' } });
      }
    }
  }, [state.status, state.currentCaseId, state.completedCaseIds, dispatch]);

  if (state.status === 'intro') {
    return <ColdOpen />;
  }

  if (state.status === 'debrief') {
    return <XRayDebrief state={state} dispatch={dispatch} />;
  }

  return (
    <div className="min-h-screen bg-[#071018] text-white flex flex-col md:flex-row overflow-hidden relative">
      {/* Left Rail (Desktop) */}
      <div className="hidden lg:flex w-[260px] p-6 flex-col border-r border-white/10 shrink-0 bg-[#0A141C]">
        <LeftRail state={state} />
      </div>

      {/* Mobile Top HUD */}
      <div className="lg:hidden p-4 border-b border-white/10 shrink-0 bg-[#0A141C] flex justify-between items-center z-10 shadow-md">
        <div className="font-bold font-serif">PHANH! {state.currentTime}</div>
        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1"><span className="text-blue-400">♦</span> {state.walletShield}</div>
          <div className="flex items-center gap-1"><span className="text-green-400">♦</span> {state.identityShield}</div>
          <div className="flex items-center gap-1"><span className="text-pink-400">♦</span> {state.familyTrust}</div>
        </div>
      </div>
      
      {/* Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center p-0 lg:p-8 relative overflow-hidden bg-black/20">
        <PhoneShell time={state.currentTime}>
           {state.currentSceneId ? (
              <SceneRenderer state={state} dispatch={dispatch} />
           ) : (
              <div className="h-full flex items-center justify-center bg-black">
                <div className="animate-pulse text-gray-500 text-sm">Đang chờ sự kiện...</div>
              </div>
           )}
        </PhoneShell>
      </div>

      {/* Right Rail (Desktop) */}
      <div className="hidden lg:flex w-[340px] p-6 flex-col border-l border-white/10 shrink-0 bg-[#0A141C] overflow-y-auto custom-scrollbar">
        <RightRail state={state} />
      </div>
    </div>
  );
}
