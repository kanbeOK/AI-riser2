import React from 'react';
import { GameScene } from '../../../game/schema';

export function SystemScene({ scene, dispatch, state }: { scene: GameScene, dispatch: any, state: any }) {
  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#071018] text-white p-8 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-red-900/10 backdrop-blur-3xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-3xl font-serif font-bold mb-4">{scene.title}</h2>
        <p className="text-gray-400 mb-12">{scene.content.text}</p>
        
        {scene.actions.length > 0 ? (
          <div className="space-y-3 w-full max-w-xs mx-auto">
            {scene.actions.map(action => (
              <button
                key={action.id}
                onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, revealsClueIds: action.revealsClueIds, ...action.effects } })}
                className="w-full p-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 transition-colors"
              >
                {action.label}
              </button>
            ))}
          </div>
        ) : (
          <button
            onClick={() => dispatch({ type: 'COMPLETE_CASE', payload: { caseId: state.currentCaseId } })}
            className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs rounded-lg hover:bg-gray-200 transition-colors"
          >
            Tiếp tục
          </button>
        )}
      </div>
    </div>
  );
}
