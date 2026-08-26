import React from 'react';
import { Shield, ShieldAlert, Heart, Activity } from 'lucide-react';
import { GameState } from '../../game/types';

export function GameHUD({ state }: { state: GameState }) {
  const getColor = (val: number) => {
    if (val >= 70) return 'text-safe';
    if (val >= 40) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className="flex flex-col gap-6 p-6 bg-surface-alt/50 border border-ink/10 rounded-xl h-full">
      <div>
        <h3 className="font-serif italic text-xl mb-4 text-ink">Bảng Điều Khiển</h3>
        <p className="text-xs uppercase tracking-widest opacity-60 font-bold font-sans">Trạng thái hệ thống</p>
      </div>
      
      <div className="space-y-4">
        <ResourceBar icon={<Shield className="w-5 h-5" />} label="Ví điện tử" value={state.walletShield} color={getColor(state.walletShield)} />
        <ResourceBar icon={<ShieldAlert className="w-5 h-5" />} label="Danh tính" value={state.identityShield} color={getColor(state.identityShield)} />
        <ResourceBar icon={<Heart className="w-5 h-5" />} label="Gia đình" value={state.familyTrust} color={getColor(state.familyTrust)} />
        <ResourceBar icon={<Activity className="w-5 h-5" />} label="Áp lực" value={state.pressure} color={state.pressure > 70 ? 'text-danger' : 'text-warning'} reverse />
      </div>

      <div className="mt-8">
        <h4 className="text-[10px] uppercase tracking-widest font-bold mb-4 opacity-60">Bằng chứng</h4>
        <div className="flex gap-2 flex-wrap">
          {state.collectedEvidenceIds.length === 0 ? (
            <span className="text-xs italic opacity-50">Chưa có bằng chứng</span>
          ) : (
            state.collectedEvidenceIds.map(id => (
              <span key={id} className="text-[10px] bg-ink/10 px-2 py-1 rounded-sm uppercase">{id.substring(0, 8)}...</span>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function ResourceBar({ icon, label, value, color, reverse = false }: any) {
  const percentage = reverse ? value : value;
  const barColor = reverse 
    ? (value > 70 ? 'bg-danger' : 'bg-warning') 
    : (value > 70 ? 'bg-safe' : value > 40 ? 'bg-warning' : 'bg-danger');

  return (
    <div className="flex items-center gap-4">
      <div className={`p-2 bg-white rounded-md shadow-sm ${color}`}>{icon}</div>
      <div className="flex-1">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wide mb-1">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
        <div className="h-2 bg-ink/10 rounded-full overflow-hidden">
          <div className={`h-full ${barColor} transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
      </div>
    </div>
  );
}
