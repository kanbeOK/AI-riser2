import React from 'react';
import { Battery, Wifi, Signal } from 'lucide-react';

export function PhoneShell({ time, children }: { time: string, children: React.ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] h-[800px] max-h-[90vh] bg-black rounded-[40px] shadow-2xl overflow-hidden border-[12px] border-ink/90 flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 inset-x-0 h-6 bg-black rounded-b-3xl w-1/2 mx-auto z-50"></div>
      
      {/* Status Bar */}
      <div className="h-12 bg-black/90 text-white px-6 flex justify-between items-center text-xs font-sans z-40">
        <span className="font-bold">{time}</span>
        <div className="flex items-center gap-2">
          <Signal className="w-3 h-3" />
          <Wifi className="w-3 h-3" />
          <Battery className="w-4 h-4" />
        </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-surface relative overflow-hidden flex flex-col">
        {children}
      </div>
      
      {/* Home Bar */}
      <div className="h-6 bg-surface-alt flex items-center justify-center pb-2 z-40">
        <div className="w-1/3 h-1 bg-ink/30 rounded-full"></div>
      </div>
    </div>
  );
}
