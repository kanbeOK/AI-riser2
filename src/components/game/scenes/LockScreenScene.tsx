import React from 'react';
import { GameScene } from '../../../game/schema';

export function LockScreenScene({ scene, dispatch, state }: { scene: GameScene, dispatch: any, state: any }) {
  return (
    <div className="h-full w-full relative">
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop")' }}>
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
      </div>
      
      <div className="relative z-10 pt-20 px-4 flex flex-col h-full">
        <div className="text-center mb-12">
          <div className="text-6xl font-extralight tracking-tighter">{state.currentTime}</div>
          <div className="text-sm font-medium opacity-80 mt-2">Thứ Tư, 26 tháng 8</div>
        </div>
        
        <div className="space-y-3">
          {scene.actions.map(action => (
            <button
              key={action.id}
              onClick={() => dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: action.id, safe: action.riskTag === 'safe', nextSceneId: action.nextSceneId, ...action.effects } })}
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl p-4 text-left transition-colors flex gap-4 items-center"
            >
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-xl shrink-0">
                {action.id.includes('delivery') ? '📦' : (action.id.includes('bank') ? '🏦' : '💬')}
              </div>
              <div>
                <div className="font-bold text-sm">
                  {action.id.includes('delivery') ? 'Giao Hàng' : (action.id.includes('bank') ? 'Ngân Hàng' : 'Gia Đình')}
                </div>
                <div className="text-sm opacity-90 line-clamp-1">{action.label}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
