import { GameCase, GameScene } from "../schema";

export const CASES: Record<string, GameCase> = {
  "c1_qr_delivery": {
    id: "c1_qr_delivery",
    title: "Mã QR giao hàng",
    startTime: "07:30",
    difficulty: "easy",
    initialSceneId: "s1_lockscreen",
    tactics: ["greed", "urgency"],
    source: {
      publisher: "Công an Lai Châu",
      title: "Cảnh giác với chiêu trò lừa đảo quét mã QR trong thanh toán online",
      url: "https://congan.laichau.gov.vn/thu-doan-pham-toi/canh-giac-voi-chieu-tro-lua-dao-quet-ma-qr-trong-thanh-toan-online-3416.html",
      publicationDate: "2023-01-01",
      accessDate: "2026-08-25"
    },
    scenes: {
      "s1_lockscreen": {
        id: "s1_lockscreen",
        channel: "lockscreen",
        title: "Màn hình khóa",
        content: {
          text: "Có 3 thông báo mới.",
        },
        clueIds: [],
        actions: [
          { id: "open_delivery", label: "Mở thông báo Giao Hàng", interaction: "continue", nextSceneId: "s2_chat", riskTag: "safe", effects: { timeMinutes: 1 } },
          { id: "open_family", label: "Mở thông báo Gia Đình", interaction: "continue", nextSceneId: "s1_lockscreen", riskTag: "safe", effects: {} },
          { id: "open_bank", label: "Mở thông báo Ngân Hàng", interaction: "continue", nextSceneId: "s1_lockscreen", riskTag: "safe", effects: {} }
        ]
      },
      "s2_chat": {
        id: "s2_chat",
        channel: "chat",
        title: "Giao Hàng Nhanh (Giả mạo)",
        content: {
          senderName: "Giao Hàng Tiết Kiệm",
          senderAvatar: "/avatar-delivery.png",
          text: "Khách hàng có đơn hàng bị hoàn trả. Vui lòng quét mã QR đính kèm hoặc truy cập đường link example.invalid/nhan-tien để làm thủ tục nhận lại tiền phí bảo hiểm 50,000 VND. Nhanh chóng thực hiện trong 24h để tránh mất phí lưu kho.",
          attachment: { type: "qr", url: "/qr-fake.png", previewUrl: "example.invalid/nhan-tien" }
        },
        clueIds: [],
        actions: [
          { id: "inspect_profile", label: "Xem hồ sơ người gửi", interaction: "inspect", nextSceneId: "s3_profile", riskTag: "safe", effects: { timeMinutes: 1 }, revealsClueIds: ["clue_c1_new_account"] },
          { id: "hold_url", label: "Kiểm tra link/QR", interaction: "hold_preview", nextSceneId: "s4_url_preview", riskTag: "safe", effects: { timeMinutes: 1 } },
          { id: "open_app", label: "Mở App Giao Hàng chính thức", interaction: "open_app", nextSceneId: "s5_official_app", riskTag: "safe", effects: { timeMinutes: 2 } },
          { id: "click_url", label: "Truy cập link", interaction: "continue", nextSceneId: "s6_browser_risky", riskTag: "caution", effects: { timeMinutes: 1 } },
          { id: "block", label: "Chặn & Báo cáo", interaction: "block", nextSceneId: "s7_safe_end", riskTag: "safe", effects: { pressure: -10, timeMinutes: 1 } }
        ]
      },
      "s3_profile": {
        id: "s3_profile",
        channel: "chat",
        title: "Hồ sơ người gửi",
        content: {
          text: "Tài khoản cá nhân. Đăng ký cách đây 2 ngày. Không có dấu tích xanh xác thực doanh nghiệp."
        },
        clueIds: ["clue_c1_new_account"],
        actions: [
          { id: "save_clue", label: "Lưu bằng chứng", interaction: "save_evidence", nextSceneId: "s2_chat", riskTag: "safe", effects: {} },
          { id: "back", label: "Quay lại", interaction: "continue", nextSceneId: "s2_chat", riskTag: "safe", effects: {} }
        ]
      },
      "s4_url_preview": {
        id: "s4_url_preview",
        channel: "browser",
        title: "Xem trước liên kết",
        content: {
          html: "<div class='text-red-500 font-bold'>CẢNH BÁO</div><div>Domain hiển thị: example.invalid</div><div>Domain thực tế: phishing.invalid</div>"
        },
        clueIds: ["clue_c1_domain_mismatch"],
        actions: [
          { id: "save_evidence", label: "Lưu bằng chứng", interaction: "save_evidence", nextSceneId: "s2_chat", riskTag: "safe", effects: {}, revealsClueIds: ["clue_c1_domain_mismatch"] },
          { id: "close", label: "Đóng", interaction: "continue", nextSceneId: "s2_chat", riskTag: "safe", effects: {} },
          { id: "continue_unsafe", label: "Vẫn truy cập", interaction: "continue", nextSceneId: "s6_browser_risky", riskTag: "unsafe", effects: {} }
        ]
      },
      "s5_official_app": {
        id: "s5_official_app",
        channel: "official_app",
        title: "App Giao Hàng",
        content: {
          text: "Trạng thái đơn hàng: Không có đơn nào đang chờ hoàn tiền. Hỗ trợ khách hàng: Không có yêu cầu bồi thường."
        },
        clueIds: ["clue_c1_no_matching_order"],
        actions: [
          { id: "verify_safe", label: "Đã xác minh", interaction: "continue", nextSceneId: "s2_chat", riskTag: "safe", effects: {}, revealsClueIds: ["clue_c1_no_matching_order"] },
          { id: "report_app", label: "Báo cáo số điện thoại giả mạo", interaction: "report", nextSceneId: "s7_safe_end", riskTag: "safe", effects: { wallet: 5, pressure: -20, timeMinutes: 2 } }
        ]
      },
      "s6_browser_risky": {
        id: "s6_browser_risky",
        channel: "browser",
        title: "Nhận Tiền - Trình duyệt",
        content: {
          html: "<div class='bg-yellow-900/50 p-4 rounded text-yellow-200 text-xs mb-4'>MÔ PHỎNG AN TOÀN — KHÔNG GIAO DỊCH THẬT</div><div>Vui lòng nhập thông tin số tài khoản và mã OTP để nhận 50,000 VND hoàn tiền bảo hiểm.</div>"
        },
        clueIds: [],
        actions: [
          { id: "stop_now", label: "Dừng lại, thoát trang", interaction: "recover", nextSceneId: "s2_chat", riskTag: "recovery", effects: { identity: -10, pressure: 10, timeMinutes: 2 } },
          { id: "submit_fake_data", label: "Nhập thông tin", interaction: "continue", nextSceneId: "s8_unsafe_end", riskTag: "unsafe", effects: { identity: -40, wallet: -30, pressure: 30, timeMinutes: 5 } }
        ]
      },
      "s7_safe_end": {
        id: "s7_safe_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Bạn đã an toàn vượt qua tình huống này." },
        clueIds: [],
        actions: []
      },
      "s8_unsafe_end": {
        id: "s8_unsafe_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Thông tin của bạn đã bị lộ." },
        clueIds: [],
        actions: []
      }
    }
  },
  "c2_job_commission": {
    id: "c2_job_commission",
    title: "Việc nhẹ lương cao",
    startTime: "12:15",
    difficulty: "medium",
    initialSceneId: "s1_chat",
    tactics: ["greed", "urgency"],
    source: {
      publisher: "Cổng Thông tin điện tử Bộ Công an",
      title: "Lừa đảo chiếm đoạt tài sản trên mạng xã hội",
      url: "https://bocongan.gov.vn/bai-viet/lua-dao-chiem-doat-tai-san-tren-mang-xa-hoi-thu-doan-khong-moi-nhung-nhieu-nguoi-van-mac-bay-d22-t31608",
      publicationDate: "2023-01-01",
      accessDate: "2026-08-25"
    },
    scenes: {
      "s1_chat": {
        id: "s1_chat",
        channel: "chat",
        title: "Nhà Tuyển Dụng",
        content: { text: "Xin chào! Công ty chúng tôi tuyển CTV chốt đơn online. Hoa hồng 20% mỗi đơn. Nạp 200k kích hoạt." },
        clueIds: [],
        actions: [
          { id: "block", label: "Chặn", interaction: "block", nextSceneId: "s_end", riskTag: "safe", effects: {} },
          { id: "accept", label: "Đồng ý nạp tiền", interaction: "continue", nextSceneId: "s_end", riskTag: "unsafe", effects: { wallet: -20 } }
        ]
      },
      "s_end": {
        id: "s_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Hoàn tất case." },
        clueIds: [],
        actions: []
      }
    }
  },
  "c3_bank_impersonation": {
    id: "c3_bank_impersonation",
    title: "Mạo danh ngân hàng",
    startTime: "15:30",
    difficulty: "medium",
    initialSceneId: "s1_call",
    tactics: ["authority", "fear", "urgency"],
    source: {
      publisher: "Hiệp hội Ngân hàng",
      title: "Cẩn trọng trước các chiêu trò giả danh",
      url: "https://vnba.org.vn/vi/can-trong-truoc-cac-chieu-tro-gia-danh-nhan-vien-ngan-hang-19892.htm",
      publicationDate: "2023-01-01",
      accessDate: "2026-08-25"
    },
    scenes: {
      "s1_call": {
        id: "s1_call",
        channel: "call",
        title: "Cuộc gọi đến",
        content: { text: "Nhân viên ngân hàng thông báo tài khoản bị trừ tiền, yêu cầu đọc OTP." },
        clueIds: [],
        actions: [
          { id: "hang_up", label: "Cúp máy", interaction: "block", nextSceneId: "s_end", riskTag: "safe", effects: {} },
          { id: "give_otp", label: "Đọc OTP", interaction: "continue", nextSceneId: "s_end", riskTag: "unsafe", effects: { wallet: -50 } }
        ]
      },
      "s_end": {
        id: "s_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Hoàn tất case." },
        clueIds: [],
        actions: []
      }
    }
  },
  "c4_police_impersonation": {
    id: "c4_police_impersonation",
    title: "Cơ quan chức năng",
    startTime: "17:40",
    difficulty: "hard",
    initialSceneId: "s1_call",
    tactics: ["authority", "fear"],
    source: {
      publisher: "Bộ Công An",
      title: "Kịp thời ngăn chặn thủ đoạn giả danh công an",
      url: "https://bocongan.gov.vn/bai-viet/kip-thoi-ngan-chan-thu-doan-gia-danh-can-bo-cong-an-lua-dao-chiem-doat-tai-san-1766401188",
      publicationDate: "2023-01-01",
      accessDate: "2026-08-25"
    },
    scenes: {
      "s1_call": {
        id: "s1_call",
        channel: "call",
        title: "Cuộc gọi đến",
        content: { text: "Công an yêu cầu phối hợp điều tra." },
        clueIds: [],
        actions: [
          { id: "hang_up", label: "Cúp máy", interaction: "block", nextSceneId: "s_end", riskTag: "safe", effects: {} }
        ]
      },
      "s_end": {
        id: "s_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Hoàn tất case." },
        clueIds: [],
        actions: []
      }
    }
  },
  "c5_family_emergency": {
    id: "c5_family_emergency",
    title: "Người thân cấp cứu",
    startTime: "21:20",
    difficulty: "hard",
    initialSceneId: "s1_call",
    tactics: ["fear", "urgency", "sympathy"],
    source: {
      publisher: "Cổng Thông tin điện tử Bộ Công an",
      title: "Khi bệnh viện trường học trở thành địa bàn",
      url: "https://cdcsnd1.bocongan.gov.vn/home/tin-tuc-su-kien/tin-trong-nuoc/khi-benh-vien-truong-hoc-tro-thanh-dia-ban-hoat-dong-cua-cac-doi-tuong-11127",
      publicationDate: "2023-01-01",
      accessDate: "2026-08-25"
    },
    scenes: {
      "s1_call": {
        id: "s1_call",
        channel: "call",
        title: "Cuộc gọi đến",
        content: { text: "Giáo viên thông báo con cấp cứu cần tiền mổ gấp." },
        clueIds: [],
        actions: [
          { id: "verify", label: "Xác minh trường", interaction: "continue", nextSceneId: "s_end", riskTag: "safe", effects: {} }
        ]
      },
      "s_end": {
        id: "s_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Hoàn tất case." },
        clueIds: [],
        actions: []
      }
    }
  },
  "c6_romance_investment": {
    id: "c6_romance_investment",
    title: "Đầu tư tài chính",
    startTime: "23:47",
    difficulty: "hard",
    initialSceneId: "s1_chat",
    tactics: ["sympathy", "greed"],
    source: {
      publisher: "Cổng Thông tin điện tử Bộ Công an",
      title: "Cảnh báo dụ dỗ đầu tư tài chính",
      url: "https://bocongan.gov.vn/bai-viet/canh-bao-thu-doan-du-do-tham-gia-dau-tu-tai-chinh-san-chung-khoan-tien-ao-tren-khong-gian-mang-d22-t44828",
      publicationDate: "2023-01-01",
      accessDate: "2026-08-25"
    },
    scenes: {
      "s1_chat": {
        id: "s1_chat",
        channel: "chat",
        title: "Tin nhắn",
        content: { text: "Anh vừa chốt lời, em tham gia nhé." },
        clueIds: [],
        actions: [
          { id: "block", label: "Chặn", interaction: "block", nextSceneId: "s_end", riskTag: "safe", effects: {} }
        ]
      },
      "s_end": {
        id: "s_end",
        channel: "system",
        title: "Kết thúc",
        content: { text: "Hoàn tất case." },
        clueIds: [],
        actions: []
      }
    }
  }
};

export const CASE_ORDER = [
  "c1_qr_delivery",
  "c2_job_commission",
  "c3_bank_impersonation",
  "c4_police_impersonation",
  "c5_family_emergency",
  "c6_romance_investment"
];
