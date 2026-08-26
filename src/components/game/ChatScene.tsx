import React, { useState } from 'react';
import { Send, ShieldOff } from 'lucide-react';
import { GameAction, GameState } from '../../game/types';

export function ChatScene({ state, dispatch }: { state: GameState, dispatch: React.Dispatch<GameAction> }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: 'reply', safe: false, scoreDelta: -5, pressureDelta: 10 } });
    dispatch({ type: 'SUBMIT_REPLY', payload: { text } });
    setText('');
  };

  const handleReport = () => {
    dispatch({ type: 'CHOOSE_ACTION', payload: { actionId: 'report', safe: true, scoreDelta: 20, pressureDelta: -10, nextStatus: 'case_complete' } });
    dispatch({ type: 'COMPLETE_CASE', payload: {} });
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {state.messageHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.sender === 'player' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.sender === 'player' 
                ? 'bg-signal text-white rounded-tr-sm' 
                : 'bg-surface text-ink border border-ink/10 rounded-tl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {state.status === 'awaiting_ai' && (
          <div className="flex justify-start">
            <div className="p-3 bg-surface border border-ink/10 rounded-2xl rounded-tl-sm shadow-sm text-xs text-ink/50 italic">
              Đang nhập...
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface-alt p-3 border-t border-ink/10 shrink-0 space-y-2">
        <div className="flex gap-2 mb-2">
          <button 
            onClick={handleReport}
            className="flex-1 py-2 bg-danger/10 text-danger border border-danger/20 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2"
          >
            <ShieldOff className="w-3 h-3" /> Chặn
          </button>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            disabled={state.status === 'awaiting_ai'}
            placeholder="Trả lời..."
            className="flex-1 px-4 py-3 bg-white border border-ink/10 rounded-full text-sm outline-none focus:border-signal disabled:opacity-50"
          />
          <button 
            onClick={handleSend}
            disabled={!text.trim() || state.status === 'awaiting_ai'}
            className="w-11 h-11 flex items-center justify-center bg-signal text-white rounded-full disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
