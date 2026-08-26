import React from 'react';
import { GameState } from '../../game/types';

export function RightRail({ state }: { state: GameState }) {
  return (
    <div className="flex flex-col h-full gap-6">
      <div>
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Trạng thái khiên chắn</div>
        <div className="space-y-4">
          <ResourceBar label="Tài sản (Ví)" value={state.walletShield} color="bg-blue-500" icon="💰" />
          <ResourceBar label="Danh tính" value={state.identityShield} color="bg-green-500" icon="ID" />
          <ResourceBar label="Gia đình" value={state.familyTrust} color="bg-pink-500" icon="❤️" />
        </div>
      </div>

      <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
        <div className="text-xs text-red-400 uppercase tracking-widest mb-2 flex justify-between">
          <span>Áp lực</span>
          <span>{state.pressure}%</span>
        </div>
        <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
          <div className="h-full bg-red-500 transition-all duration-300" style={{ width: `${state.pressure}%` }}></div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="text-xs text-gray-400 uppercase tracking-widest mb-4">Bằng chứng thu thập ({state.collectedEvidenceIds.length})</div>
        {state.collectedEvidenceIds.length === 0 ? (
          <div className="text-sm text-gray-600 italic">Chưa có bằng chứng nào được ghim. Nhấn vào các thông tin đáng ngờ để lưu lại.</div>
        ) : (
          <div className="space-y-3">
            {state.collectedEvidenceIds.map(id => (
              <div key={id} className="p-3 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300 flex items-start gap-3">
                <span className="text-yellow-500 mt-0.5">📌</span>
                <span>{getClueText(id)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ResourceBar({ label, value, color, icon }: { label: string, value: number, color: string, icon: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs font-bold mb-1.5">
        <span className="flex items-center gap-1.5"><span className="opacity-70">{icon}</span> {label}</span>
        <span>{value}%</span>
      </div>
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${color} transition-all duration-500`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
}

function getClueText(id: string) {
  const map: Record<string, string> = {
    "clue_c1_new_account": "Tài khoản cá nhân mới tạo, không tích xanh.",
    "clue_c1_domain_mismatch": "Đường link đính kèm dẫn đến website giả mạo (phishing.invalid).",
    "clue_c1_no_matching_order": "Ứng dụng Giao Hàng chính thức không có đơn nào đang chờ hoàn tiền."
  };
  return map[id] || id;
}
