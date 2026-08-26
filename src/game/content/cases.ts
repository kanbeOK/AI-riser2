export type ScenarioId = string;

export type CaseDefinition = {
  id: ScenarioId;
  title: string;
  type: "chat" | "call" | "transaction" | "social";
  tactics: string[];
  observableCues: string[];
  learningObjective: string;
  initialMessage: string;
};

export const CASES: Record<ScenarioId, CaseDefinition> = {
  c1_qr_delivery: {
    id: "c1_qr_delivery",
    title: "Mã QR Giao hàng",
    type: "chat",
    tactics: ["Giả mạo", "Gây áp lực thời gian"],
    observableCues: ["Gửi mã QR yêu cầu thanh toán ngoài ứng dụng", "Đe dọa hoàn hàng"],
    learningObjective: "Không quét mã QR lạ từ shipper giả mạo",
    initialMessage: "Chào bạn, tôi là shipper. Bạn có đơn hàng 250k. Vui lòng quét mã QR này để thanh toán vì tôi đang vội."
  },
  c2_job_commission: {
    id: "c2_job_commission",
    title: "Tuyển dụng việc nhẹ lương cao",
    type: "social",
    tactics: ["Đánh vào lòng tham", "Cam kết lợi nhuận"],
    observableCues: ["Yêu cầu nạp tiền để nhận nhiệm vụ", "Lợi nhuận cao bất thường"],
    learningObjective: "Nhận diện bẫy lừa đảo cộng tác viên chốt đơn",
    initialMessage: "Tuyển CTV đánh giá sản phẩm. Làm tại nhà, thu nhập 500k-1tr/ngày. Nhấn link để đăng ký nhận 100k ngay."
  },
  c3_bank_impersonation: {
    id: "c3_bank_impersonation",
    title: "Mạo danh ngân hàng",
    type: "call",
    tactics: ["Dọa nạt", "Giả danh cơ quan"],
    observableCues: ["Yêu cầu cung cấp mã OTP", "Số điện thoại cá nhân gọi thay vì tổng đài"],
    learningObjective: "Không bao giờ cung cấp mã OTP cho bất kỳ ai",
    initialMessage: "Chào anh/chị, tôi gọi từ ngân hàng. Tài khoản của anh/chị vừa bị trừ 5 triệu. Đọc mã OTP gửi về máy để chúng tôi hủy giao dịch."
  }
};
