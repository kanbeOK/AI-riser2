import { useState } from "react";
import {
  BedDouble,
  BriefcaseBusiness,
  DoorClosed,
  LampDesk,
  Laptop,
  MonitorUp,
  Refrigerator,
  Router,
  Utensils,
  WalletCards,
} from "lucide-react";
import type { CampaignState, GameAction, SideJobState } from "../../game/state/types";

type ApartmentProps = {
  state: CampaignState;
  dispatch: React.Dispatch<GameAction>;
};

type Zone = "desk" | "bed" | "laptop" | "fridge" | "router" | "rent";

const SIDE_JOB: SideJobState = {
  id: "caption_cleanup",
  name: "Làm sạch phụ đề",
  progress: 0,
  maxProgress: 2,
  reward: 28,
  energyCost: 16,
  timeCost: 50,
};

function formatTime(minutes: number): string {
  return `${Math.floor(minutes / 60).toString().padStart(2, "0")}:${(minutes % 60)
    .toString()
    .padStart(2, "0")}`;
}

export function Apartment({ state, dispatch }: ApartmentProps) {
  const [activeZone, setActiveZone] = useState<Zone>("desk");
  const internetPaid = state.internetPaidThroughDay >= state.day;
  const jobCompleted = state.completedSideJobDays.includes(state.day);

  const buyFood = () => {
    dispatch({
      type: "BUY_ITEM",
      payload: {
        cost: 14,
        item: {
          id: `food_banhmi_${state.day}_${state.inventory.length}`,
          name: "Bánh mì",
          type: "food",
          effectValue: 28,
        },
      },
    });
  };

  return (
    <main className="apartment-screen">
      <header className="apartment-hud">
        <div>
          <span className="eyebrow">CĂN HỘ 404 / ĐÊM {state.day}</span>
          <strong>{formatTime(state.minuteOfDay)}</strong>
        </div>
        <div className="apartment-resources">
          <span>CR <strong>{state.credits}</strong></span>
          <span>Năng lượng <strong>{Math.round(state.energy)}%</strong></span>
          <span>No bụng <strong>{Math.round(state.hunger)}%</strong></span>
        </div>
      </header>

      <section className="apartment-stage" aria-label="Căn hộ của điều tra viên">
        <div className="city-window" aria-hidden="true">
          <div className="city-building building-a" />
          <div className="city-building building-b" />
          <div className="city-building building-c" />
          <div className="window-rain" />
        </div>
        <div className="room-light" aria-hidden="true" />
        <div className="room-floor" aria-hidden="true" />

        <button
          className={`room-object desk-object ${activeZone === "desk" ? "active" : ""}`}
          onClick={() => setActiveZone("desk")}
          aria-label="Chọn bàn làm việc"
        >
          <span className="desk-monitor"><MonitorUp /></span>
          <span className="desk-surface" />
          <span className="desk-leg desk-leg-left" />
          <span className="desk-leg desk-leg-right" />
          <span className="object-caption">Bàn làm việc</span>
        </button>

        <button
          className={`room-object bed-object ${activeZone === "bed" ? "active" : ""}`}
          onClick={() => setActiveZone("bed")}
          aria-label="Chọn giường ngủ"
        >
          <BedDouble />
          <span className="bed-pillow" />
          <span className="object-caption">Giường</span>
        </button>

        <button
          className={`room-object laptop-object ${activeZone === "laptop" ? "active" : ""}`}
          onClick={() => setActiveZone("laptop")}
          aria-label="Chọn laptop làm thêm"
        >
          <Laptop />
          <span className="object-caption">Việc làm thêm</span>
        </button>

        <button
          className={`room-object fridge-object ${activeZone === "fridge" ? "active" : ""}`}
          onClick={() => setActiveZone("fridge")}
          aria-label="Chọn tủ lạnh"
        >
          <Refrigerator />
          <i className={state.inventory.length > 0 ? "fridge-led on" : "fridge-led"} />
          <span className="object-caption">Tủ lạnh</span>
        </button>

        <button
          className={`room-object router-object ${activeZone === "router" ? "active" : ""}`}
          onClick={() => setActiveZone("router")}
          aria-label="Chọn router internet"
        >
          <Router />
          <i className={internetPaid ? "router-wave online" : "router-wave"} />
          <span className="object-caption">Router</span>
        </button>

        <button
          className={`room-object door-object ${activeZone === "rent" ? "active" : ""}`}
          onClick={() => setActiveZone("rent")}
          aria-label="Chọn hóa đơn tiền nhà"
        >
          <DoorClosed />
          {!state.rentPaid && <span className="rent-envelope">HẠN {state.rentDueDay}</span>}
          <span className="object-caption">Tiền nhà</span>
        </button>

        <div className="desk-lamp" aria-hidden="true"><LampDesk /></div>
      </section>

      <section className="apartment-console" aria-live="polite">
        <div className="zone-tabs" aria-label="Chọn vật dụng">
          <button className={activeZone === "desk" ? "active" : ""} onClick={() => setActiveZone("desk")}><MonitorUp /> Bàn</button>
          <button className={activeZone === "bed" ? "active" : ""} onClick={() => setActiveZone("bed")}><BedDouble /> Ngủ</button>
          <button className={activeZone === "laptop" ? "active" : ""} onClick={() => setActiveZone("laptop")}><BriefcaseBusiness /> Làm thêm</button>
          <button className={activeZone === "fridge" ? "active" : ""} onClick={() => setActiveZone("fridge")}><Utensils /> Ăn</button>
          <button className={activeZone === "router" ? "active" : ""} onClick={() => setActiveZone("router")}><Router /> Mạng</button>
          <button className={activeZone === "rent" ? "active" : ""} onClick={() => setActiveZone("rent")}><WalletCards /> Thuê nhà</button>
        </div>

        <div className="zone-panel">
          {activeZone === "desk" && (
            <>
              <div>
                <span>TRẠM ĐIỀU TRA</span>
                <h2>{state.phase === "shift" ? "Ca trực đang tạm dừng" : state.phase === "evening" ? "Ca đêm đã khép" : "Có hai tín hiệu đang chờ"}</h2>
                <p>{state.phase === "evening" ? "Bạn có thể làm thêm, ăn hoặc đi ngủ." : "Vào workstation để nhận briefing và theo dõi các luồng song song."}</p>
              </div>
              {state.phase !== "evening" && (
                <button className="console-action primary" onClick={() => dispatch({ type: "ENTER_WORKSTATION" })}>
                  <MonitorUp size={17} /> {state.phase === "shift" ? "Tiếp tục ca trực" : "Vào ca trực"}
                </button>
              )}
            </>
          )}

          {activeZone === "bed" && (
            <>
              <div>
                <span>GIẤC NGỦ</span>
                <h2>{state.phase === "evening" ? "Khép ngày hiện tại" : "Chưa thể ngủ"}</h2>
                <p>Ngủ hồi năng lượng, giảm độ no và chuyển lịch sang ngày tiếp theo.</p>
              </div>
              <button
                className="console-action primary"
                disabled={state.phase !== "evening"}
                onClick={() => dispatch({ type: "SLEEP" })}
              >
                <BedDouble size={17} /> Ngủ sang ngày mới
              </button>
            </>
          )}

          {activeZone === "laptop" && (
            <>
              <div>
                <span>VIỆC LÀM THÊM</span>
                <h2>{jobCompleted ? "Đã hoàn thành hôm nay" : state.activeSideJob ? state.activeSideJob.name : SIDE_JOB.name}</h2>
                <p>+{SIDE_JOB.reward} CR · -{SIDE_JOB.energyCost} năng lượng · {SIDE_JOB.timeCost} phút. Chỉ nhận thưởng một lần mỗi ngày.</p>
              </div>
              {jobCompleted ? (
                <div className="completed-chip">ĐÃ KHÓA REWARD</div>
              ) : state.activeSideJob ? (
                <button className="console-action" onClick={() => dispatch({ type: "WORK_JOB", payload: { progress: 1 } })}>
                  <Laptop size={17} /> Làm việc ({state.activeSideJob.progress}/{state.activeSideJob.maxProgress})
                </button>
              ) : (
                <button
                  className="console-action"
                  disabled={state.energy < SIDE_JOB.energyCost}
                  onClick={() => dispatch({ type: "START_JOB", payload: { job: SIDE_JOB } })}
                >
                  <BriefcaseBusiness size={17} /> Nhận việc
                </button>
              )}
            </>
          )}

          {activeZone === "fridge" && (
            <>
              <div>
                <span>TỦ LẠNH / {state.inventory.length} MÓN</span>
                <h2>{state.inventory.length > 0 ? "Còn đồ ăn" : "Tủ lạnh trống"}</h2>
                <div className="food-actions">
                  {state.inventory.map((item) => (
                    <button key={item.id} onClick={() => dispatch({ type: "EAT", payload: { itemId: item.id } })}>
                      Ăn {item.name} (+{item.effectValue})
                    </button>
                  ))}
                </div>
              </div>
              <button className="console-action" disabled={state.credits < 14} onClick={buyFood}>
                <Utensils size={17} /> Mua bánh mì / 14 CR
              </button>
            </>
          )}

          {activeZone === "router" && (
            <>
              <div>
                <span>INTERNET</span>
                <h2>{internetPaid ? "Đường truyền ổn định" : "OSINT đang bị khóa"}</h2>
                <p>Phí ngày: 12 CR. Chat timeline vẫn có deterministic fallback khi Gemini không khả dụng.</p>
              </div>
              <button
                className="console-action"
                disabled={internetPaid || state.credits < 12}
                onClick={() => dispatch({ type: "PAY_INTERNET" })}
              >
                <Router size={17} /> {internetPaid ? "Đã thanh toán" : "Gia hạn / 12 CR"}
              </button>
            </>
          )}

          {activeZone === "rent" && (
            <>
              <div>
                <span>HÓA ĐƠN / HẠN NGÀY {state.rentDueDay}</span>
                <h2>{state.rentPaid ? "Tiền nhà đã thanh toán" : `${state.rentAmount} CR còn thiếu`}</h2>
                <p>Đây là mục tiêu đời sống dài hạn. Thắng vụ án nhưng mất căn hộ vẫn là một ending thất bại.</p>
              </div>
              <button
                className="console-action danger"
                disabled={state.rentPaid || state.credits < state.rentAmount}
                onClick={() => dispatch({ type: "PAY_RENT" })}
              >
                <WalletCards size={17} /> {state.rentPaid ? "Đã thanh toán" : `Trả ${state.rentAmount} CR`}
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
