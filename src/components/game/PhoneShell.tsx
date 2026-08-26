import React from 'react';

export function PhoneShell({ time, children }: { time: string, children: React.ReactNode }) {
  return (
    <div className="w-full h-full lg:w-[400px] lg:h-[800px] lg:rounded-[40px] overflow-hidden lg:border-[12px] border-gray-900 bg-black relative shadow-2xl flex flex-col mx-auto lg:my-auto shrink-0 ring-1 ring-white/10">
      {/* Top status bar - absolute for immersive, relative for standard apps depending on scene */}
      <div className="absolute top-0 inset-x-0 h-10 px-6 flex justify-between items-center text-xs text-white z-50 mix-blend-difference pointer-events-none">
        <div className="font-bold">{time}</div>
        <div className="flex gap-2">
          <span>5G</span>
          <span>100%</span>
        </div>
      </div>
      
      {/* Notch simulation (Desktop only visually) */}
      <div className="hidden lg:block absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-[16px] z-50"></div>

      {/* Screen Content */}
      <div className="flex-1 w-full h-full relative overflow-hidden bg-black text-white">
        {children}
      </div>
      
      {/* Bottom indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-white/30 rounded-full z-50 pointer-events-none"></div>
    </div>
  );
}
