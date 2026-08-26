import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { GameShell } from './components/game/GameShell';

function IntroScreen() {
  return (
    <div className="min-h-screen bg-[#071018] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tighter mb-6 text-white drop-shadow-md">PHANH! 24H</h1>
      <p className="font-serif italic text-2xl md:text-3xl text-gray-400 mb-4">Giữ ví. Giữ danh tính. Giữ người thân.</p>
      <p className="font-sans text-sm tracking-widest uppercase opacity-60 mb-16 max-w-xl leading-relaxed">
        Bạn có an toàn đến 00:00?
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link to="/game?mode=solo" className="bg-red-600 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-red-700 transition-colors">
          Chơi một mình
        </Link>
        <Link to="/game?mode=squad" className="border border-white/20 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors">
          Chơi cùng gia đình
        </Link>
      </div>
      <div className="flex gap-4">
        <Link to="/game?demo=true" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity p-2">Trình diễn 90 giây</Link>
      </div>
      <div className="mt-16 flex gap-6">
        <Link to="/case-board" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Phòng giám định</Link>
        <Link to="/profile" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Hồ sơ</Link>
        <Link to="/about" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Thông tin</Link>
      </div>
    </div>
  );
}

function ForensicsScreen() {
  return (
    <div className="min-h-screen bg-[#071018] text-white flex flex-col">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0D1922]">
        <Link to="/" className="text-2xl font-black font-serif tracking-tighter text-white">PHANH! 24H</Link>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white">Thoát</Link>
      </header>
      <div className="flex-1 overflow-auto p-6 max-w-7xl mx-auto w-full">
        <h1 className="text-2xl font-bold mb-6">Hồ sơ chuyên án</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="p-6 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
             <h3 className="font-bold text-lg mb-2 text-white">Mã QR giao hàng</h3>
             <p className="text-sm text-gray-400">Đã giải quyết</p>
           </div>
        </div>
      </div>
    </div>
  );
}

function ProfileScreen() {
  return (
    <div className="min-h-screen bg-[#071018] text-white flex flex-col">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0D1922]">
        <Link to="/" className="text-2xl font-black font-serif tracking-tighter text-white">PHANH! 24H</Link>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white">Thoát</Link>
      </header>
      <div className="flex-1 overflow-auto p-6 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 font-serif">Hồ sơ cá nhân</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
           <div className="p-6 bg-white/5 rounded-xl border border-white/10">
             <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Cấp bậc</div>
             <div className="text-3xl font-bold text-blue-400">Tân binh</div>
           </div>
           <div className="p-6 bg-white/5 rounded-xl border border-white/10">
             <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Điểm cao nhất</div>
             <div className="text-3xl font-bold text-green-400">8,500</div>
           </div>
           <div className="p-6 bg-white/5 rounded-xl border border-white/10">
             <div className="text-sm text-gray-400 uppercase tracking-widest mb-2">Huy hiệu</div>
             <div className="text-3xl font-bold text-yellow-400">2</div>
           </div>
        </div>
        <h2 className="text-xl font-bold mb-4 font-serif">Bảng xếp hạng trên thiết bị</h2>
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
           <div className="p-4 border-b border-white/10 flex justify-between text-sm text-gray-400 uppercase tracking-widest">
             <span>Người chơi</span>
             <span>Điểm</span>
           </div>
           <div className="p-4 flex justify-between text-white border-b border-white/5">
             <span>Player 1</span>
             <span className="font-bold">8,500</span>
           </div>
        </div>
      </div>
    </div>
  );
}

function AboutScreen() {
  return (
    <div className="min-h-screen bg-[#071018] text-white p-8 md:p-16">
      <Link to="/" className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-white mb-8 block">&larr; Trở lại</Link>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif font-bold text-white">Thông tin dự án</h1>
        <p className="text-gray-400 leading-relaxed text-lg">
          PHANH! 24H - Giữ ví. Giữ danh tính. Giữ người thân.
          <br/><br/>
          Tất cả dữ liệu mô phỏng dựa trên nguồn chính thống.
        </p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/game" element={<GameShell />} />
        <Route path="/case-board" element={<ForensicsScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/about" element={<AboutScreen />} />
      </Routes>
    </Router>
  );
}
