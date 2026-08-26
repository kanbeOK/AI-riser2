import React, { useReducer, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { campaignReducer, INITIAL_STATE } from './game/state/reducer';
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
  const [state, dispatch] = useReducer(campaignReducer, INITIAL_STATE);
  
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
      <div className="min-h-screen bg-[#071018] text-white flex flex-col items-center p-8 overflow-y-auto">
        <h1 className="text-4xl font-bold mb-4 font-serif text-[#45D6BF]">BÁO CÁO MẮT LƯỚI</h1>
        
        <div className="w-full max-w-2xl bg-[#11171C] border border-[#2A363D] p-6 rounded-xl mb-8 font-mono">
          <h2 className="text-xl mb-4 border-b border-[#2A363D] pb-2 text-[#F2B35D]">X-RAY: KẾT QUẢ CÁC VỤ ÁN</h2>
          {Object.values(state.cases).length === 0 ? (
             <p className="text-[#86949B]">Không có hồ sơ nào được ghi nhận.</p>
          ) : Object.values(state.cases).map(c => (
             <div key={c.id} className="mb-4 bg-[#172127] p-4 rounded">
                <div className="flex justify-between mb-2">
                   <strong className="text-white">{c.title}</strong>
                   <span className={`text-xs px-2 py-1 rounded font-bold ${c.verdict === 'warned' ? 'bg-[#45D6BF] text-[#080B0E]' : c.verdict === 'frozen' ? 'bg-[#F2B35D] text-[#080B0E]' : c.verdict === 'banned' ? 'bg-[#FF5A5F] text-[#080B0E]' : 'bg-[#2A363D] text-[#86949B]'}`}>
                     {c.verdict ? c.verdict.toUpperCase() : 'CHƯA XỬ LÝ'}
                   </span>
                </div>
                <div className="text-sm text-[#86949B]">
                   Bằng chứng thu thập: {c.evidenceIds.length} <br/>
                   {c.verdict ? 'Nạn nhân được bảo vệ hoặc tài khoản bị khóa kịp thời.' : 'Kẻ gian đã tẩu thoát do thiếu sự can thiệp.'}
                </div>
             </div>
          ))}
        </div>

        <div className="text-gray-400 mb-8 max-w-lg text-center font-serif text-xl">
          {state.endingsUnlocked.includes('e_nguoi_tot_khong_nha') && <div className="mb-2 text-[#FF5A5F]">Bạn đã bị đuổi khỏi căn hộ vì nợ tiền nhà.</div>}
          {state.endingsUnlocked.includes('e_kiet_suc') && <div className="mb-2 text-[#FF5A5F]">Bạn đã sụp đổ vì kiệt sức. Sức khỏe là vốn quý nhất.</div>}
          {!state.endingsUnlocked.length && "Ca trực kết thúc an toàn. Chúc ngủ ngon."}
        </div>
        
        <Link to="/" onClick={() => window.location.href = '/'} className="px-8 py-4 bg-[#45D6BF] text-[#080B0E] font-bold rounded hover:bg-white transition-colors tracking-widest uppercase text-xs">TRỞ VỀ MENU</Link>
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
