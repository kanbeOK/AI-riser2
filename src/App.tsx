import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { ShieldCheck, Crosshair, BarChart, Smartphone } from 'lucide-react';

import { Onboarding } from './features/Onboarding';
import { Missions } from './features/Missions';
import { MissionPlay } from './features/MissionPlay';
import { Checker } from './features/Checker';
import { Impact } from './features/Impact';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper flex flex-col font-sans">
      <header className="px-6 md:px-12 py-8 border-b border-ink/10 flex flex-col md:flex-row items-center justify-between bg-paper gap-6 md:gap-0">
        <Link to="/" className="text-3xl font-black font-serif tracking-tighter text-ink">PHANH.</Link>
        <nav className="flex gap-6 md:gap-8 text-[11px] tracking-[0.2em] font-sans uppercase font-bold opacity-60 flex-wrap justify-center">
          <Link to="/missions" className="hover:opacity-100 transition-opacity">Nhiệm vụ</Link>
          <Link to="/check" className="hover:opacity-100 transition-opacity">Kiểm tra</Link>
          <Link to="/impact" className="hover:opacity-100 transition-opacity">Tiến bộ</Link>
        </nav>
      </header>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

function LandingPage() {
  return (
    <main className="flex flex-col items-center min-h-[calc(100vh-100px)] px-6 py-12 md:py-20 text-center bg-paper text-ink relative">
      <div className="absolute top-12 left-12 tracking-[0.3em] font-sans font-bold uppercase text-[10px] hidden md:block opacity-40">
        Issue No. 1
      </div>
      <div className="absolute bottom-12 right-12 tracking-[0.3em] font-sans font-bold uppercase text-[10px] hidden md:block opacity-40">
        Volume I
      </div>
      <div className="flex flex-col items-center justify-center max-w-4xl flex-1 relative z-10 w-full">
        <h1 className="text-[60px] sm:text-[80px] md:text-[140px] leading-[0.85] font-black font-serif tracking-tighter mb-6 text-ink">
          PHANH<span className="opacity-40">.</span>
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          <div className="w-12 h-[1px] bg-ink/30 hidden md:block"></div>
          <p className="font-serif italic text-2xl md:text-3xl text-ink/80">
            Dính bẫy giả. Né mất tiền thật.
          </p>
          <div className="w-12 h-[1px] bg-ink/30 hidden md:block"></div>
        </div>
        <p className="font-sans text-xs md:text-sm leading-relaxed uppercase tracking-[0.1em] md:tracking-[0.2em] opacity-80 mb-16 max-w-2xl px-4">
          Mô phỏng lừa đảo trực tuyến với AI. Luyện phản xạ bảo vệ bản thân và người thân trong môi trường an toàn 100%. (Mô phỏng hư cấu, không yêu cầu cung cấp bí mật hay tiền thật)
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full justify-center items-center px-4">
          <Link 
            to="/onboarding" 
            className="flex items-center justify-center gap-3 bg-ink text-paper px-8 py-5 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-ink/80 transition-all rounded-none w-full sm:w-auto"
          >
            Thử một bẫy 90 giây <span className="text-lg leading-none">&rarr;</span>
          </Link>
          <Link 
            to="/check" 
            className="flex items-center justify-center gap-3 bg-paper text-ink border border-ink/40 px-8 py-5 uppercase tracking-[0.2em] text-[11px] font-bold hover:bg-ink/5 transition-all rounded-none w-full sm:w-auto"
          >
            Kiểm tra tin nhắn
          </Link>
        </div>
      </div>
      
      <div className="mt-16 md:mt-auto pt-16 flex flex-wrap gap-8 border-t border-ink/10 w-full justify-center px-4">
        <Link to="/impact" className="text-[11px] tracking-[0.2em] uppercase font-sans font-bold opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
          Tiến bộ của bạn
        </Link>
        <Link to="/missions" className="text-[11px] tracking-[0.2em] uppercase font-sans font-bold opacity-60 hover:opacity-100 transition-opacity flex items-center gap-2">
          Thư viện kịch bản
        </Link>
      </div>
    </main>
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
