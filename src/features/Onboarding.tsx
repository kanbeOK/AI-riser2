import { useState } from "react";
import { useNavigate } from "react-router";
import { User, Briefcase, Home, ShoppingBag, Eye, EyeOff } from "lucide-react";

const PROFILES = [
  { id: "student", label: "Sinh viên / mới đi làm", icon: User },
  { id: "shopper", label: "Người mua bán online", icon: ShoppingBag },
  { id: "office", label: "Nhân viên văn phòng / kinh doanh", icon: Briefcase },
  { id: "family", label: "Gia đình / người lớn tuổi", icon: Home },
];

export function Onboarding() {
  const navigate = useNavigate();
  const [selectedProfile, setSelectedProfile] = useState<string | null>(null);
  const [easyRead, setEasyRead] = useState(false);

  const handleStart = () => {
    if (!selectedProfile) return;
    // In a real app, save this to context/local storage/Firebase
    localStorage.setItem("phanh_profile", selectedProfile);
    localStorage.setItem("phanh_easyRead", easyRead ? "true" : "false");
    navigate("/missions");
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-8">
      <div className="mb-16 text-center border-b border-ink/10 pb-12">
        <div className="text-[10px] tracking-[0.4em] font-sans uppercase opacity-40 mb-6">Bước 01. Hồ Sơ</div>
        <h1 className="text-5xl font-black font-serif tracking-tighter text-ink mb-6">Xác Định Đối Tượng.</h1>
        <p className="font-sans text-xs tracking-widest uppercase opacity-60 leading-relaxed max-w-xl mx-auto">Chọn một hồ sơ để hệ thống điều chỉnh các kịch bản lừa đảo bám sát rủi ro thực tế.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 mb-16 border-t border-l border-ink/10">
        {PROFILES.map((p) => {
          const Icon = p.icon;
          const isSelected = selectedProfile === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProfile(p.id)}
              className={`flex flex-col items-start p-8 border-r border-b border-ink/10 text-left transition-all rounded-none ${
                isSelected 
                  ? "bg-ink text-paper" 
                  : "bg-transparent text-ink hover:bg-ink/5"
              }`}
            >
              <Icon className="w-6 h-6 mb-8 opacity-80" strokeWidth={1.5} />
              <span className="font-serif italic text-lg">{p.label}</span>
            </button>
          );
        })}
      </div>

      <div className="mb-16">
        <label className="flex items-center justify-between p-8 bg-transparent border border-ink/10 cursor-pointer hover:bg-ink/5 transition-colors rounded-none">
          <div className="flex-1 pr-8">
            <div className="font-serif italic text-xl text-ink mb-2">Chế Độ Dễ Đọc</div>
            <div className="text-[10px] tracking-[0.2em] font-sans uppercase opacity-50">Cỡ chữ lớn, tương phản cao, loại bỏ áp lực thời gian.</div>
          </div>
          <div className="flex items-center gap-6">
            {easyRead ? <Eye className="w-5 h-5 text-ink" strokeWidth={1.5} /> : <EyeOff className="w-5 h-5 opacity-40" strokeWidth={1.5} />}
            <input 
              type="checkbox" 
              checked={easyRead}
              onChange={(e) => setEasyRead(e.target.checked)}
              className="w-5 h-5 text-ink border-ink/20 rounded-none focus:ring-0 cursor-pointer"
            />
          </div>
        </label>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleStart}
          disabled={!selectedProfile}
          className="bg-ink text-paper px-12 py-5 uppercase tracking-[0.2em] text-[10px] font-bold rounded-none disabled:opacity-30 disabled:cursor-not-allowed hover:bg-ink/80 transition-colors flex items-center gap-4"
        >
          Tiến Hành Luyện Tập <span className="text-lg leading-none">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
