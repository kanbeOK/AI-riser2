import React, { useEffect } from 'react';
import { useGameSession } from '../../game/useGameSession';
import { PhoneShell } from './PhoneShell';
import { GameHUD } from './GameHUD';
import { CASES } from '../../game/content/cases';
import { AIConnector } from './AIConnector';
import { ChatScene } from './ChatScene';
import { CaseComplete } from './CaseComplete';
import { DebriefScreen } from './DebriefScreen';

export function GameShell() {
  const { state, dispatch, reset } = useGameSession();

  useEffect(() => {
    if (state.status === 'intro') {
      setTimeout(() => {
        dispatch({ type: 'START_RUN', payload: { mode: 'solo', difficulty: 'normal' } });
      }, 1000);
    }
  }, [state.status, dispatch]);

  useEffect(() => {
    if (state.status === 'playing' && !state.currentCaseId) {
      const unusedCases = CASES.filter(c => !state.completedCaseIds.includes(c.id));
      if (unusedCases.length > 0) {
        const nextCase = unusedCases[Math.floor(Math.random() * unusedCases.length)]!;
        dispatch({ 
          type: 'RECEIVE_EVENT', 
          payload: { 
            caseId: nextCase.id, 
            sceneId: 'start', 
            channel: 'chat', 
            message: nextCase.initialMessage 
          } 
        });
      } else {
        dispatch({ type: 'END_RUN', payload: { endingId: 'e_gatekeeper' } });
      }
    }
  }, [state.status, state.currentCaseId, state.completedCaseIds, dispatch]);

  return (
    <>
      <AIConnector state={state} dispatch={dispatch} />
      {state.status === 'debrief' && <DebriefScreen state={state} dispatch={dispatch} />}
      <div className="min-h-screen bg-[#071018] text-white p-4 md:p-8 flex flex-col md:flex-row gap-8 items-center justify-center">
        <div className="w-full md:w-1/3 max-w-sm">
          {state.status !== 'intro' && <GameHUD state={state} />}
        </div>
        
        <div className="w-full md:w-1/3 flex justify-center">
          <PhoneShell time={state.currentTime}>
            <div className="h-full flex flex-col">
              <div className="bg-surface-alt p-4 shadow-sm border-b border-ink/5 shrink-0">
                <h2 className="font-bold text-ink text-center">
                  {state.currentCaseId ? CASES.find(c => c.id === state.currentCaseId)?.title : 'Đang tải...'}
                </h2>
              </div>
              
              <div className="flex-1 overflow-hidden relative">
                {state.status === 'case_complete' ? (
                  <CaseComplete state={state} dispatch={dispatch} />
                ) : (
                  <ChatScene state={state} dispatch={dispatch} />
                )}
              </div>
            </div>
          </PhoneShell>
        </div>

        <div className="w-full md:w-1/3 max-w-sm hidden lg:block">
        </div>
      </div>
    </>
  );
}
