import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { gameReducer, INITIAL_STATE } from './game/state/reducer';
import { CampaignState, GameAction } from './game/state/types';
import { Apartment } from './components/apartment/Apartment';
import { Workstation } from './components/desktop/Workstation';

function IntroScreen() {
  return (
    <div className="min-h-screen bg-[#071018] text-white flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-6xl md:text-8xl font-black font-serif tracking-tighter mb-6 text-white drop-shadow-md">PHANH! // MẮT LƯỚI</h1>
      <p className="font-serif italic text-2xl md:text-3xl text-gray-400 mb-4">CA TRỰC 00:00</p>
      <p className="font-sans text-sm tracking-widest uppercase opacity-60 mb-16 max-w-xl leading-relaxed">
        Một ca trực. Sáu đường dây. Tiền nhà đến hạn.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 mb-16">
        <Link to="/game?mode=solo" className="bg-[#45D6BF] text-[#080B0E] px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-teal-400 transition-colors">
          Bắt đầu ca trực
        </Link>
        <Link to="/game?mode=demo" className="border border-white/20 text-white px-8 py-4 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-white/10 transition-colors">
          Trình diễn 90 giây
        </Link>
      </div>
      <div className="text-xs uppercase tracking-widest opacity-40">MÔ PHỎNG AN TOÀN — KHÔNG GIÁM SÁT HOẶC GIAO DỊCH THẬT</div>
    </div>
  );
}

function GameRoot() {
  const [state, dispatch] = useReducer(gameReducer, INITIAL_STATE);
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    dispatch({ type: 'START_CAMPAIGN', payload: { mode: params.get('mode') === 'demo' ? 'demo' : 'solo' } });
  }, []);

  // Time loop
  useEffect(() => {
    let interval: any;
    if (state.status === 'playing' && state.speed > 0) {
      interval = setInterval(() => {
        dispatch({ type: 'TICK', payload: { minutes: 1 } });
      }, 1000 / state.speed);
    }
    return () => clearInterval(interval);
  }, [state.status, state.speed]);
  
  // Pause on blur
  useEffect(() => {
    const handleBlur = () => {
      if (state.status === 'playing' && state.speed > 0) {
        dispatch({ type: 'SET_SPEED', payload: { speed: 0 } });
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [state.status, state.speed]);

  if (state.status === 'debrief') {
    return (
      <div className="min-h-screen bg-[#071018] text-white flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-8">Báo cáo kết thúc</h1>
        <div className="text-gray-400 mb-8 max-w-lg text-center">
          {state.endingsUnlocked.includes('e_nguoi_tot_khong_nha') && "Bạn đã bảo vệ được nhiều người, nhưng lại không thể trả tiền nhà. Bạn bị đuổi khỏi căn hộ."}
          {state.endingsUnlocked.includes('e_kiet_suc') && "Bạn đã sụp đổ vì kiệt sức. Sức khỏe là vốn quý nhất, đừng bỏ bê nó."}
          {!state.endingsUnlocked.length && "Ca trực kết thúc."}
        </div>
        <Link to="/" className="px-6 py-3 bg-[#45D6BF] text-[#080B0E] font-bold rounded">Về trang chủ</Link>
      </div>
    );
  }

  if (state.location === 'apartment') {
    return <Apartment state={state} dispatch={dispatch} />;
  }

  return <Workstation state={state} dispatch={dispatch} />;
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroScreen />} />
        <Route path="/game" element={<GameRoot />} />
      </Routes>
    </Router>
  );
}
