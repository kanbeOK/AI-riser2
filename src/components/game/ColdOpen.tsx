import React from 'react';

export function ColdOpen() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
       <div className="text-center animate-pulse">
          <div className="text-sm font-mono text-gray-500 tracking-widest uppercase mb-4">Đang khởi tạo môi trường...</div>
          <div className="w-48 h-1 bg-white/10 mx-auto rounded-full overflow-hidden">
             <div className="w-1/2 h-full bg-red-600 animate-[slide_1s_ease-in-out_infinite]"></div>
          </div>
       </div>
    </div>
  );
}
