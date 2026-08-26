import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { ShieldCheck, Crosshair, BarChart, Smartphone } from 'lucide-react';

import { Onboarding } from './features/Onboarding';
import { Missions } from './features/Missions';
import { MissionPlay } from './features/MissionPlay';
import { Checker } from './features/Checker';
import { Impact } from './features/Impact';

function LandingPage() {
  return (
    <main className="flex flex-col items-center min-h-[calc(100vh-80px)] px-6 py-20 text-center bg-paper text-ink relative">
      <div className="absolute top-12 left-12 tracking-[0.3em] font-sans font-bold uppercase text-[10px] hidden md:block opacity-40">
        Issue No. 1
      </div>
      <div className="absolute bottom-12 right-12 tracking-[0.3em] font-sans font-bold uppercase text-[10px] hidden md:block opacity-40">
        Volume I
      </div>
      <div className="flex flex-col items-center justify-center max-w-4xl flex-1 relative z-10">
        <h1 className="text-[80px] md:text-[140px] leading-[0.85] font-black font-serif tracking-tighter mb-6 text-ink">
          PHANH<span className="opacity-40">.</span>
        </h1>
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-ink/30"></div>
          <p className="font-serif italic text-2xl md:text-3xl text-ink/80">
            Dính bẫy giả. Né mất tiền thật.
          </p>
          <div className="w-12 h-[1px] bg-ink/30"></div>
        </div>
        <p className="font-sans text-xs leading-relaxed uppercase tracking-[0.2em] opacity-60 mb-16 max-w-2xl">
          Mô phỏng lừa đảo trực tuyến với AI. Luyện phản xạ bảo vệ bản thân và người thân trong môi trường an toàn 100%. (Mô phỏng hư cấu, không yêu cầu cung cấp bí mật hay tiền thật)
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center">
          <Link 
            to="/onboarding" 
            className="flex items-center justify-center gap-3 bg-ink text-paper px-10 py-5 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-ink/80 transition-all rounded-none"
          >
            Thử một bẫy 90 giây <span className="text-lg leading-none">&rarr;</span>
          </Link>
          <Link 
            to="/check" 
            className="flex items-center justify-center gap-3 bg-paper text-ink border border-ink/20 px-10 py-5 uppercase tracking-[0.2em] text-[10px] font-bold hover:bg-ink/5 transition-all rounded-none"
          >
            Kiểm tra tin nhắn đáng ngờ
          </Link>
        </div>
      </div>
      
      <div className="mt-auto pt-24 flex gap-12 border-t border-ink/10 w-full justify-center">
        <Link to="/impact" className="text-[10px] tracking-[0.2em] uppercase font-sans font-bold opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
          Tác động thực tế
        </Link>
        <Link to="/missions" className="text-[10px] tracking-[0.2em] uppercase font-sans font-bold opacity-40 hover:opacity-100 transition-opacity flex items-center gap-2">
          Thư viện kịch bản
        </Link>
      </div>
    </main>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      <header className="px-12 py-8 border-b border-ink/10 flex items-center justify-between bg-paper">
        <Link to="/" className="text-3xl font-black font-serif tracking-tighter text-ink">PHANH.</Link>
        <nav className="flex gap-8 text-[10px] tracking-[0.2em] font-sans uppercase font-bold opacity-50">
          <Link to="/missions" className="hover:opacity-100 transition-opacity">Nhiệm vụ</Link>
          <Link to="/check" className="hover:opacity-100 transition-opacity">Kiểm tra</Link>
          <Link to="/impact" className="hover:opacity-100 transition-opacity">Impact</Link>
        </nav>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/onboarding" element={<Layout><Onboarding /></Layout>} />
        <Route path="/missions" element={<Layout><Missions /></Layout>} />
        <Route path="/mission/:scenarioId" element={<Layout><MissionPlay /></Layout>} />
        <Route path="/check" element={<Layout><Checker /></Layout>} />
        <Route path="/impact" element={<Layout><Impact /></Layout>} />
      </Routes>
    </Router>
  );
}
