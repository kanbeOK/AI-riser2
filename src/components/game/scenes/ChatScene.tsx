import React, { useState } from 'react';
import { GameScene } from '../../../game/schema';

export function ChatScene({ scene, dispatch, state }: { scene: GameScene, dispatch: any, state: any }) {
  const [showActions, setShowActions] = useState(false);

  return (
    <div className="h-full flex flex-col bg-[#0A141C]">
      {/* Header */}
      <div className="bg-[#132530] p-4 flex items-center gap-3 border-b border-white/5 shadow-sm">
        <button onClick={() => {}} className="text-blue-400">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden flex items-center justify-center shrink-0">
          {scene.content.senderAvatar ? (
             <span className="text-xl">📦</span>
          ) : (
             <span className="text-xl">👤</span>
          )}
        </div>
        <div className="flex-1">
          <div className="font-bold text-sm">{scene.content.senderName || scene.title}</div>
          <div className="text-xs text-gray-400">{scene.id === 's3_profile' ? 'Hồ sơ' : 'Trực tuyến'}</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0A141C]">
        {scene.id === 's3_profile' ? (
           <div className="bg-[#132530] p-6 rounded-2xl border border-white/5 text-center space-y-4 mt-8">
             <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto flex items-center justify-center text-4xl">👤</div>
             <h2 className="font-bold text-xl">{scene.content.senderName || scene.title}</h2>
             <p className="text-gray-400">{scene.content.text}</p>
             <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
                {scene.actions.map(action => (
                  <button 
                    key={action.id}
                    onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, revealsClueIds: action.revealsClueIds, ...action.effects } })}
                    className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-sm transition-colors"
                  >
                    {action.label}
                  </button>
                ))}
             </div>
           </div>
        ) : (
           <div className="flex gap-2 max-w-[85%]">
             <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0 flex items-center justify-center text-sm mt-auto">👤</div>
             <div className="bg-[#1C2C38] rounded-2xl rounded-bl-none p-3 text-sm text-gray-200">
               <p>{scene.content.text}</p>
               {scene.content.attachment && (
                 <div className="mt-3 bg-white p-2 rounded-lg inline-block">
                   <div className="w-32 h-32 bg-gray-200 flex items-center justify-center text-black font-bold">QR CODE</div>
                   <div className="text-center text-xs text-gray-500 mt-1">{scene.content.attachment.previewUrl}</div>
                 </div>
               )}
               <div className="text-[10px] text-gray-500 mt-2 text-right">{state.currentTime}</div>
             </div>
           </div>
        )}
      </div>

      {/* Input / Action Dock */}
      {scene.id !== 's3_profile' && (
        <div className="bg-[#132530] p-4 border-t border-white/5">
          {showActions ? (
             <div className="grid grid-cols-2 gap-2 mb-2">
               {scene.actions.map(action => (
                 <button
                   key={action.id}
                   onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, revealsClueIds: action.revealsClueIds, ...action.effects } })}
                   className={`p-3 text-xs font-bold rounded-xl flex items-center justify-center transition-colors ${action.riskTag === 'unsafe' ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}
                 >
                   {action.label}
                 </button>
               ))}
             </div>
          ) : (
             <div className="flex gap-2">
               <div className="flex-1 bg-black/30 rounded-full border border-white/10 px-4 py-2.5 text-sm text-gray-500 flex items-center">Nhập tin nhắn...</div>
               <button 
                 onClick={() => setShowActions(true)}
                 className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors shrink-0"
               >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
               </button>
             </div>
          )}
        </div>
      )}
    </div>
  );
}
