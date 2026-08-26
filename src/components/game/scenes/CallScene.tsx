import React from 'react';
import { GameScene } from '../../../game/schema';

export function CallScene({ scene, dispatch, state }: { scene: GameScene, dispatch: any, state: any }) {
  return (
    <div className="h-full flex flex-col bg-gray-900 text-white relative">
      {/* Call Header */}
      <div className="pt-20 pb-8 flex flex-col items-center justify-center text-center">
         <div className="w-24 h-24 bg-gray-700 rounded-full mb-4 flex items-center justify-center text-4xl">📞</div>
         <h2 className="text-2xl font-bold">{scene.title}</h2>
         <p className="text-gray-400 mt-2">00:03</p>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center">
         <div className="bg-black/50 p-4 rounded-2xl border border-white/10 text-center w-full max-w-xs">
           <p className="text-sm text-gray-300 italic">"{scene.content.text}"</p>
         </div>
      </div>
      
      {/* Actions */}
      <div className="p-8 pb-12 flex justify-center gap-6">
         {scene.actions.map(action => (
           <button
             key={action.id}
             onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, revealsClueIds: action.revealsClueIds, ...action.effects } })}
             className={`w-16 h-16 rounded-full flex flex-col items-center justify-center transition-transform hover:scale-110 ${action.riskTag === 'unsafe' ? 'bg-red-500' : 'bg-red-600'}`}
           >
             <span className="text-xs font-bold mt-1 max-w-full truncate px-1">{action.label}</span>
           </button>
         ))}
      </div>
    </div>
  );
}
