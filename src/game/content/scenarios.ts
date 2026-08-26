
import { EntityType, EvidenceTemplate, StoryBeat, ScenarioDefinition } from './content';

export const SCENARIOS: Record<string, ScenarioDefinition> = {
  c1_qr_delivery: {
    id: "c1_qr_delivery",
    title: "Mã QR Giao hàng",
    type: "chat",
    tactics: ["Giả mạo", "Gây áp lực thời gian"],
    learningObjective: "Không quét mã QR lạ từ shipper giả mạo",
    evidenceBase: {
      c1_domain: {
        id: "c1_domain",
        label: "Domain thanh toán",
        entityType: "domain",
        displayValue: "vietship-pay.test",
        lookupResult: "Domain đăng ký hôm qua qua dịch vụ ẩn danh. Host tại IP liên kết với mạng lưới nghi ngờ CÒ XÁM.",
        relatedEntityIds: ["coxam_ip", "c1_account"],
        educationalNote: "Kẻ gian thường tạo domain giả mạo nhái các hãng vận chuyển."
      },
      c1_account: {
        id: "c1_account",
        label: "STK Cá nhân",
        entityType: "bankAccount",
        displayValue: "9988776655 (Nguyen Van A)",
        lookupResult: "Tài khoản cá nhân, không thuộc tổ chức doanh nghiệp. Dòng tiền chuyển đến liên tục được rút ra.",
        relatedEntityIds: ["c1_domain"],
        educationalNote: "Công ty giao hàng không dùng tài khoản cá nhân cho cổng thanh toán."
      },
      c1_qrPayload: {
        id: "c1_qrPayload",
        label: "Mã QR",
        entityType: "qrPayload",
        displayValue: "Chứa link tới vietship-pay.test thay vì lệnh chuyển tiền trực tiếp",
        lookupResult: "QR không phải chuẩn EMVCo của ngân hàng mà là URL chuyển hướng tải mã độc/phishing.",
        relatedEntityIds: ["c1_domain"],
        educationalNote: "Luôn kiểm tra nội dung mã QR trước khi mở."
      },
      c1_phone: {
        id: "c1_phone",
        label: "SĐT Shipper",
        entityType: "phone",
        displayValue: "0901234567",
        lookupResult: "SIM rác, kích hoạt được 3 ngày.",
        relatedEntityIds: ["coxam_device"],
        educationalNote: "SIM rác thường được dùng để lừa đảo."
      }
    },
    beats: [
      { id: "b1", sender: 'scammer', senderName: 'VietShip', text: "Chào bạn, tôi là shipper. Bạn có đơn hàng 250k đang chờ dưới sảnh.", clues: ["c1_phone"], waitBefore: 0 },
      { id: "b2", sender: 'scammer', senderName: 'VietShip', text: "Tôi đang vội giao tuyến khác, bạn quét mã QR này thanh toán rồi xuống lấy luôn nhé.", clues: ["c1_qrPayload"], waitBefore: 1 },
      { id: "b3", sender: 'scammer', senderName: 'VietShip', text: "Nếu không thanh toán trong 5 phút tôi sẽ đánh dấu hoàn hàng.", clues: [], waitBefore: 2 },
      { id: "b4", sender: 'system', senderName: 'System', text: "[Nạn nhân đã truy cập vào vietship-pay.test và chuẩn bị chuyển tiền vào STK 9988776655]", clues: ["c1_domain", "c1_account"], waitBefore: 2 }
    ],
    redHerringClues: ["c1_phone"],
    deadlineMinutes: 10
  },
  c2_legit_shipper: {
    id: "c2_legit_shipper",
    title: "Shipper hiểu lầm",
    type: "chat",
    tactics: [],
    learningObjective: "Không báo cáo nhầm người giao hàng hợp pháp",
    evidenceBase: {
      c2_domain: {
        id: "c2_domain",
        label: "Tracking Link",
        entityType: "domain",
        displayValue: "ghn.vn/tracking/123",
        lookupResult: "Domain chính thức của Giao Hàng Nhanh. Đã hoạt động 10 năm.",
        relatedEntityIds: [],
        educationalNote: "Luôn kiểm tra kỹ tên miền."
      },
      c2_account: {
        id: "c2_account",
        label: "STK Công ty",
        entityType: "bankAccount",
        displayValue: "0123456 (CÔNG TY CP GIAO HANG NHANH)",
        lookupResult: "Tài khoản doanh nghiệp hợp lệ.",
        relatedEntityIds: [],
        educationalNote: "Tài khoản doanh nghiệp thường an toàn hơn."
      },
      c2_phone: {
        id: "c2_phone",
        label: "SĐT Shipper",
        entityType: "phone",
        displayValue: "0912345678",
        lookupResult: "Thuê bao trả sau, đăng ký chính chủ.",
        relatedEntityIds: [],
        educationalNote: ""
      }
    },
    beats: [
      { id: "b1", sender: 'scammer', senderName: 'Shipper Giao Hàng Nhanh', text: "Anh có nhà không, em giao đơn mã XYZ123.", clues: ["c2_phone"], waitBefore: 0 },
      { id: "b2", sender: 'scammer', senderName: 'Shipper Giao Hàng Nhanh', text: "Anh theo dõi lộ trình qua link ghn.vn/tracking/123 nhé.", clues: ["c2_domain"], waitBefore: 1 },
      { id: "b3", sender: 'scammer', senderName: 'Shipper Giao Hàng Nhanh', text: "Anh chuyển khoản vào tài khoản công ty giúp em, không đưa tiền mặt.", clues: ["c2_account"], waitBefore: 1 }
    ],
    redHerringClues: ["c2_phone"],
    deadlineMinutes: 15
  },
  c3_commission: {
    id: "c3_commission",
    title: "Cộng tác viên",
    type: "social",
    tactics: ["Lòng tham", "Lợi nhuận lớn"],
    learningObjective: "Cảnh giác với mô hình đa cấp/việc nhẹ lương cao.",
    evidenceBase: {
      c3_domain: {
        id: "c3_domain",
        label: "Trang nhiệm vụ",
        entityType: "domain",
        displayValue: "shoppee-mall-vip.test",
        lookupResult: "Domain giả mạo thương hiệu Shopee. IP trỏ về mạng lưới CÒ XÁM.",
        relatedEntityIds: ["coxam_ip"],
        educationalNote: "Kẻ gian thường chèn thêm chữ VIP, MALL vào tên miền để đánh lừa."
      },
      c3_account: {
        id: "c3_account",
        label: "Tài khoản thu tiền",
        entityType: "bankAccount",
        displayValue: "9988776655 (Nguyen Van A)",
        lookupResult: "Trùng khớp với STK trong vụ C1.",
        relatedEntityIds: ["c1_account"],
        educationalNote: "Kẻ lừa đảo thường dùng chung tài khoản trung gian."
      }
    },
    beats: [
      { id: "b1", sender: 'scammer', senderName: 'Chuyên viên Tuyển Dụng', text: "Tuyển CTV xử lý đơn hàng Shopee. Vốn 500k, thu lãi 100k ngay lập tức.", clues: [], waitBefore: 0 },
      { id: "b2", sender: 'scammer', senderName: 'Chuyên viên Tuyển Dụng', text: "Mời bạn truy cập shoppee-mall-vip.test để nhận nhiệm vụ.", clues: ["c3_domain"], waitBefore: 1 },
      { id: "b3", sender: 'system', senderName: 'System', text: "[Nạn nhân chuẩn bị chuyển 500k vào STK 9988776655 để kích hoạt VIP]", clues: ["c3_account"], waitBefore: 2 }
    ],
    redHerringClues: [],
    deadlineMinutes: 10
  },
  c4_bank_impersonation: {
    id: "c4_bank_impersonation",
    title: "Tổng đài khóa tài khoản",
    type: "call",
    tactics: ["Giả mạo ngân hàng", "Khơi gợi nỗi sợ"],
    learningObjective: "Ngân hàng không bao giờ gọi điện yêu cầu cung cấp OTP hoặc cài app ngoài.",
    evidenceBase: {
      c4_caller: {
        id: "c4_caller",
        label: "Metadata cuộc gọi",
        entityType: "callerMetadata",
        displayValue: "Cuộc gọi VOIP quốc tế spoof số tổng đài",
        lookupResult: "Tra cứu cho thấy cuộc gọi xuất phát từ trạm phát sóng nước ngoài thuộc hạ tầng CÒ XÁM.",
        relatedEntityIds: ["coxam_ip"],
        educationalNote: "Số tổng đài hiển thị trên màn hình có thể bị giả mạo dễ dàng (Spoofing)."
      },
      c4_domain: {
        id: "c4_domain",
        label: "App bảo mật (APK)",
        entityType: "domain",
        displayValue: "vcb-smart-protect.test",
        lookupResult: "Domain chứa file APK chứa mã độc đọc lén SMS.",
        relatedEntityIds: ["coxam_ip"],
        educationalNote: "Không bao giờ cài ứng dụng từ đường link bên ngoài chợ ứng dụng chính thức."
      }
    },
    beats: [
      { id: "b1", sender: 'scammer', senderName: 'Tổng đài viên', text: "Tài khoản của bạn vừa có giao dịch bất thường 50 triệu tại nước ngoài.", clues: ["c4_caller"], waitBefore: 0 },
      { id: "b2", sender: 'scammer', senderName: 'Tổng đài viên', text: "Nếu không phải bạn thực hiện, vui lòng truy cập vcb-smart-protect.test tải app để chặn giao dịch.", clues: ["c4_domain"], waitBefore: 1 },
      { id: "b3", sender: 'scammer', senderName: 'Tổng đài viên', text: "Nhanh lên, hệ thống sẽ tự động trừ tiền trong 3 phút nữa.", clues: [], waitBefore: 2 }
    ],
    redHerringClues: [],
    deadlineMinutes: 8
  },
  c5_emergency: {
    id: "c5_emergency",
    title: "Cấp cứu",
    type: "call",
    tactics: ["Hoảng loạn", "Giả danh giáo viên"],
    learningObjective: "Giữ bình tĩnh và xác minh qua kênh độc lập khi nhận tin cấp cứu.",
    evidenceBase: {
      c5_transcript: {
        id: "c5_transcript",
        label: "Đoạn ghi âm",
        entityType: "transcript",
        displayValue: "Voice chứa tạp âm bệnh viện, giọng nói có dấu hiệu cắt ghép bằng AI.",
        lookupResult: "Quét phổ thanh âm phát hiện dấu vết sinh tự động bằng Deepfake.",
        relatedEntityIds: [],
        educationalNote: "Kẻ lừa đảo dùng AI để giả giọng người nhà."
      },
      c5_account: {
        id: "c5_account",
        label: "STK Viện phí",
        entityType: "bankAccount",
        displayValue: "11223344 (TRẦN VĂN B)",
        lookupResult: "Tài khoản cá nhân. Bệnh viện luôn thu qua số tài khoản doanh nghiệp.",
        relatedEntityIds: ["c1_account"],
        educationalNote: "Bệnh viện không yêu cầu nộp viện phí vào tài khoản cá nhân của bác sĩ."
      }
    },
    beats: [
      { id: "b1", sender: 'scammer', senderName: 'Thầy giáo', text: "Chị ơi, cháu bị ngã cầu thang ở trường, đang cấp cứu trong Việt Đức. Tình trạng nguy kịch.", clues: ["c5_transcript"], waitBefore: 0 },
      { id: "b2", sender: 'scammer', senderName: 'Thầy giáo', text: "Bác sĩ yêu cầu tạm ứng mổ gấp 30 triệu. Chị chuyển vào STK này để tôi nộp viện phí luôn.", clues: ["c5_account"], waitBefore: 1 }
    ],
    redHerringClues: [],
    deadlineMinutes: 5
  },
  c6_school_refund: {
    id: "c6_school_refund",
    title: "Hoàn phí học kỳ",
    type: "social",
    tactics: ["Lợi ích tài chính", "Cơ quan giáo dục"],
    learningObjective: "Xác minh với nhà trường trước khi thao tác trên web lạ.",
    evidenceBase: {
      c6_domain: {
        id: "c6_domain",
        label: "Cổng sinh viên",
        entityType: "domain",
        displayValue: "hoan-phi-hoc-vu-2024.test",
        lookupResult: "Domain trỏ về chung IP với vietship-pay.test và các trang phishing khác.",
        relatedEntityIds: ["c1_domain", "coxam_ip"],
        educationalNote: "Thủ đoạn chung của mạng lưới CÒ XÁM."
      },
      c6_device: {
        id: "c6_device",
        label: "Device Fingerprint",
        entityType: "deviceFingerprint",
        displayValue: "Thiết bị dùng để nhắn tin khớp với IMEI vụ shipper giả.",
        lookupResult: "Cùng một đối tượng thực hiện vụ C1 và C6.",
        relatedEntityIds: ["coxam_device", "c1_phone"],
        educationalNote: ""
      }
    },
    beats: [
      { id: "b1", sender: 'scammer', senderName: 'Phòng Tài Chính - ĐH XYZ', text: "Thông báo hoàn trả học phí đợt 1. Bạn được hoàn 2,500,000 VND.", clues: ["c6_device"], waitBefore: 0 },
      { id: "b2", sender: 'scammer', senderName: 'Phòng Tài Chính - ĐH XYZ', text: "Vui lòng đăng nhập hoan-phi-hoc-vu-2024.test để xác nhận thẻ nhận tiền.", clues: ["c6_domain"], waitBefore: 1 }
    ],
    redHerringClues: [],
    deadlineMinutes: 12
  }
};
