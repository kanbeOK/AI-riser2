import React from 'react';
import { GameScene } from '../../../game/schema';

export function OfficialAppScene({ scene, dispatch, state }: { scene: GameScene, dispatch: any, state: any }) {
  return (
    <div className="h-full flex flex-col bg-white text-black relative">
      {/* App Header */}
      <div className="bg-green-600 text-white p-4 pt-12 text-center font-bold relative">
         {scene.title}
      </div>
      
      {/* Content */}
      <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
         <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-4xl mb-4">📦</div>
         <p className="text-gray-600 mb-8">{scene.content.text}</p>
         
         <div className="w-full space-y-3 mt-auto">
            {scene.actions.map(action => (
              <button
                key={action.id}
                onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, revealsClueIds: action.revealsClueIds, ...action.effects } })}
                className="w-full p-4 rounded-xl font-bold text-sm bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
              >
                {action.label}
              </button>
            ))}
         </div>
      </div>
    </div>
  );
}
