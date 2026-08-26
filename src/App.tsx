import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { GameShell } from './components/game/GameShell';
import { Checker } from './features/Checker';

function IntroScreen() {
  return (
    <div className="min-h-screen bg-midnight text-primary-text flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tighter mb-6">PHANH! 24H</h1>
      <p className="font-serif italic text-2xl md:text-3xl text-muted-text mb-4">Giữ ví. Giữ danh tính. Giữ người thân.</p>
      <p className="font-sans text-sm tracking-widest uppercase opacity-60 mb-16 max-w-xl leading-relaxed">
        Bạn có an toàn đến 00:00? Luyện phản xạ sinh tồn số trong 24 giờ.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link to="/game" className="bg-white text-ink px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-surface-alt transition-colors">
          Bắt đầu ngày mới
        </Link>
        <Link to="/game?demo=true" className="border border-white/20 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors">
          Chế độ trình diễn 90s
        </Link>
      </div>
      <div className="mt-16 flex gap-6">
        <Link to="/forensics" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Phòng giám định</Link>
        <Link to="/about" className="text-xs uppercase tracking-widest opacity-60 hover:opacity-100 transition-opacity">Thông tin</Link>
      </div>
    </div>
  );
}

function ForensicsScreen() {
  return (
    <div className="min-h-screen bg-midnight text-white flex flex-col">
      <header className="p-6 border-b border-white/10 flex justify-between items-center bg-deep-surface">
        <Link to="/" className="text-2xl font-black font-serif tracking-tighter text-white">PHANH! 24H</Link>
        <Link to="/" className="text-xs font-bold uppercase tracking-widest text-muted-text hover:text-white">Thoát</Link>
      </header>
      <div className="flex-1 overflow-auto">
        {/* We reuse the Checker logic but styled for dark mode */}
        <Checker />
      </div>
    </div>
  );
}

function AboutScreen() {
  return (
    <div className="min-h-screen bg-midnight text-white p-8 md:p-16">
      <Link to="/" className="text-xs font-bold uppercase tracking-widest text-muted-text hover:text-white mb-8 block">&larr; Trở lại</Link>
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-4xl font-serif font-bold text-white">Thông tin dự án</h1>
        <p className="text-muted-text leading-relaxed">
          Giải quyết bài toán 17 của AI Riser 2026. Một trò chơi sinh tồn số tương tác sử dụng Gemini để tạo phản xạ an toàn.
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
        <Route path="/forensics" element={<ForensicsScreen />} />
        <Route path="/about" element={<AboutScreen />} />
        <Route path="/case-board" element={<div>Case Board (TBD)</div>} />
        <Route path="/profile" element={<div>Profile (TBD)</div>} />
      </Routes>
    </Router>
  );
}
