import React from 'react';
import { GameScene } from '../../../game/schema';

export function BrowserScene({ scene, dispatch, state }: { scene: GameScene, dispatch: any, state: any }) {
  return (
    <div className="h-full flex flex-col bg-white text-black">
      {/* Browser Chrome */}
      <div className="bg-gray-100 p-2 pt-12 flex items-center gap-2 border-b border-gray-300">
        <div className="flex gap-1 shrink-0">
          <div className="w-3 h-3 rounded-full bg-red-400"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
          <div className="w-3 h-3 rounded-full bg-green-400"></div>
        </div>
        <div className="flex-1 bg-white rounded-md px-3 py-1.5 text-xs text-gray-500 border border-gray-200 text-center truncate">
          <span className="text-gray-400">🔒</span> {scene.id === 's4_url_preview' ? 'Cảnh báo an toàn' : 'example.invalid/nhan-tien'}
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6" dangerouslySetInnerHTML={{ __html: scene.content.html || '' }}></div>
      
      {/* Actions */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex flex-col gap-2">
         {scene.actions.map(action => (
           <button
             key={action.id}
             onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, revealsClueIds: action.revealsClueIds, ...action.effects } })}
             className={`w-full p-3 rounded-lg font-bold text-sm transition-colors ${action.riskTag === 'unsafe' ? 'bg-red-500 hover:bg-red-600 text-white' : (action.riskTag === 'recovery' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800')}`}
           >
             {action.label}
           </button>
         ))}
      </div>
    </div>
  );
}
