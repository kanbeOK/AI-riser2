import { Scenario } from '../shared/types';

export const SEED_SCENARIOS: Scenario[] = [
  {
    id: "s1_fake_police",
    title: "Giả danh cơ quan điều tra",
    targetProfiles: ["family", "office"],
    difficulty: "hard",
    estimatedDuration: "90 - 150 giây",
    learningObjective: "Nhận biết chiến thuật dọa nạt, yêu cầu bảo mật thông tin và nhận ra Công an không làm việc qua điện thoại/Zalo.",
    initialMessage: "Chào anh/chị. Tôi là điều tra viên số hiệu 103, thuộc Bộ Công An. Có một tài khoản ngân hàng mang tên anh/chị đang liên quan đến đường dây buôn lậu và rửa tiền xuyên quốc gia. Yêu cầu chuyển ngay số tiền 50 triệu vào tài khoản tạm giữ của cơ quan để phục vụ điều tra, nếu không sẽ có lệnh bắt khẩn cấp. Vui lòng không tiết lộ cho ai để đảm bảo tính tuyệt mật của chuyên án.",
    groundTruthTactics: ["authority", "fear", "isolation"],
    observableCues: [
      "Tự xưng Công an làm việc qua tin nhắn/điện thoại",
      "Yêu cầu chuyển tiền vào 'tài khoản tạm giữ'",
      "Dọa nạt bắt bớ, yêu cầu giữ bí mật tuyệt đối"
    ],
    safeVerificationInstructions: "Công an không bao giờ làm việc qua điện thoại hay yêu cầu chuyển tiền. Hãy cúp máy và liên hệ trực tiếp với cơ quan công an địa phương để xác minh.",
    safeResponseScript: "Tôi không làm việc qua điện thoại. Hãy gửi giấy triệu tập chính thức về công an phường nơi tôi cư trú, tôi sẽ ra làm việc trực tiếp.",
    officialSource: {
      publisher: "Cổng Thông tin điện tử Bộ Công an",
      title: "Cảnh báo thủ đoạn giả danh cơ quan Công an, Viện kiểm sát, Tòa án để lừa đảo chiếm đoạt tài sản",
      url: "https://bocongan.gov.vn/",
      publicationDate: "2023-11-20",
      accessDate: "2026-08-25"
    }
  },
  {
    id: "s2_fake_delivery_qr",
    title: "Đơn hàng hoàn tiền bằng QR",
    targetProfiles: ["shopper", "student"],
    difficulty: "easy",
    estimatedDuration: "60 - 90 giây",
    learningObjective: "Hiểu rằng mã QR có thể chứa lệnh chuyển tiền hoặc đường link độc hại, không quét mã lạ để nhận tiền.",
    initialMessage: "Khách hàng có đơn hàng bị hoàn trả. Vui lòng quét mã QR đính kèm hoặc truy cập đường link zalo.me/fake-link để làm thủ tục nhận lại tiền phí bảo hiểm 50,000 VND. Nhanh chóng thực hiện trong 24h để tránh mất phí lưu kho.",
    groundTruthTactics: ["urgency", "greed"],
    observableCues: [
      "Yêu cầu quét QR để nhận lại tiền bảo hiểm",
      "Sử dụng số điện thoại cá nhân giả mạo tổng đài",
      "Tạo áp lực thời gian (thực hiện trong 24h)"
    ],
    safeVerificationInstructions: "Mã QR có thể chứa đường link độc hoặc lệnh chuyển tiền. Hãy tự mở ứng dụng giao hàng chính thức để kiểm tra tình trạng đơn hàng thay vì quét mã lạ.",
    safeResponseScript: "Tôi sẽ tự kiểm tra đơn hàng trên ứng dụng chính thức. Đừng gửi mã QR lạ cho tôi.",
    officialSource: {
      publisher: "Cục An toàn thông tin",
      title: "Cảnh báo lừa đảo chiếm đoạt tài sản qua hình thức gửi mã QR",
      url: "https://khonggianmang.vn/",
      publicationDate: "2024-02-15",
      accessDate: "2026-08-25"
    }
  },
  {
    id: "s3_job_commission",
    title: "Việc nhẹ lương cao",
    targetProfiles: ["student", "office"],
    difficulty: "medium",
    estimatedDuration: "90 - 120 giây",
    learningObjective: "Nhận biết bẫy lừa đảo việc làm online yêu cầu nạp tiền hoặc làm nhiệm vụ chốt đơn ảo.",
    initialMessage: "Xin chào! Công ty chúng tôi đang tuyển CTV xem video và chốt đơn online tại nhà. Chỉ cần rảnh 1-2 tiếng mỗi ngày, hoa hồng 20% mỗi đơn hàng. Thu nhập 500k - 1 triệu/ngày. Chị chỉ cần nạp 200,000 VNĐ vào tài khoản hệ thống để kích hoạt nhận nhiệm vụ đầu tiên. Làm xong rút được ngay cả gốc lẫn lãi.",
    groundTruthTactics: ["greed", "urgency"],
    observableCues: [
      "Hứa hẹn việc nhẹ lương cao, thu nhập bất thường",
      "Yêu cầu nạp tiền/đặt cọc để kích hoạt nhiệm vụ",
      "Chốt đơn ảo, không có hợp đồng lao động"
    ],
    safeVerificationInstructions: "Không có công việc nào hợp pháp yêu cầu bạn phải nạp tiền cọc để làm việc. Tìm hiểu kỹ thông tin công ty qua cổng thông tin quốc gia về đăng ký doanh nghiệp.",
    safeResponseScript: "Tôi không có nhu cầu tham gia. Bất kỳ công việc nào yêu cầu nạp tiền để nhận việc tôi đều từ chối.",
    officialSource: {
      publisher: "Trung tâm Giám sát an toàn không gian mạng quốc gia",
      title: "Cảnh báo hình thức lừa đảo tuyển cộng tác viên thanh toán đơn hàng ảo",
      url: "https://khonggianmang.vn/",
      publicationDate: "2023-08-10",
      accessDate: "2026-08-25"
    }
  },
  {
    id: "s4_support_impersonation",
    title: "Mạo danh hỗ trợ ngân hàng",
    targetProfiles: ["office", "family", "shopper"],
    difficulty: "medium",
    estimatedDuration: "60 - 100 giây",
    learningObjective: "Không cung cấp OTP, mật khẩu cho bất kỳ ai, kể cả người tự xưng là nhân viên ngân hàng.",
    initialMessage: "Kính chào quý khách. Tôi là nhân viên CSKH từ ngân hàng. Hệ thống ghi nhận tài khoản của quý khách đang có dấu hiệu bị trừ tiền bất thường từ nước ngoài. Xin quý khách đọc ngay mã OTP gồm 6 số vừa được gửi tới điện thoại để chúng tôi đóng băng tài khoản và bảo vệ tài sản cho quý khách.",
    groundTruthTactics: ["authority", "fear", "urgency"],
    observableCues: [
      "Mạo danh tổng đài gọi điện từ số cá nhân",
      "Gây hoang mang về việc tài khoản bị trừ tiền",
      "Yêu cầu cung cấp mã OTP"
    ],
    safeVerificationInstructions: "Nhân viên ngân hàng thật không bao giờ yêu cầu bạn đọc mật khẩu hoặc mã OTP. Hãy tắt máy và tự gọi lên tổng đài chính thức in mặt sau thẻ ngân hàng.",
    safeResponseScript: "Tôi sẽ không cung cấp OTP. Tôi sẽ tự gọi lên tổng đài của ngân hàng để kiểm tra.",
    officialSource: {
      publisher: "Hiệp hội Ngân hàng Việt Nam",
      title: "Khuyến cáo về các thủ đoạn lừa đảo lấy cắp thông tin tài khoản, thẻ ngân hàng",
      url: "https://vnba.org.vn/",
      publicationDate: "2024-01-05",
      accessDate: "2026-08-25"
    }
  },
  {
    id: "s5_romance_investment",
    title: "Làm quen và dụ dỗ đầu tư",
    targetProfiles: ["office", "family"],
    difficulty: "hard",
    estimatedDuration: "120 - 150 giây",
    learningObjective: "Cảnh giác với các mối quan hệ tình cảm qua mạng và các lời mời đầu tư lãi suất cao không tưởng.",
    initialMessage: "Chào em, dạo này em thế nào? Anh vừa chốt lời một lệnh giao dịch trên sàn X. Hệ thống đang có lỗ hổng nên anh biết chắc chắn 100% tỷ lệ thắng. Em tham gia cùng anh nhé, chỉ cần 5 triệu thôi, sau một đêm là nhân đôi tài khoản. Anh sẽ hướng dẫn em mở tài khoản trên trang web này.",
    groundTruthTactics: ["sympathy", "greed"],
    observableCues: [
      "Làm quen tình cảm trên mạng sau đó rủ rê đầu tư",
      "Cam kết lợi nhuận 100%, lãi cao bất thường",
      "Sử dụng sàn giao dịch hoặc ứng dụng lạ"
    ],
    safeVerificationInstructions: "Không có khoản đầu tư nào lợi nhuận cao mà không có rủi ro, nhất là khi được giới thiệu bởi người quen trên mạng chưa từng gặp mặt. Hãy cảnh giác với 'bẫy tình' lừa tiền.",
    safeResponseScript: "Cảm ơn nhưng tôi không quan tâm đến đầu tư tài chính. Đừng gửi những đường link sàn giao dịch này cho tôi nữa.",
    officialSource: {
      publisher: "Cổng Thông tin điện tử Bộ Công an",
      title: "Cảnh báo tội phạm lừa đảo qua hình thức kết bạn bốn phương, dụ dỗ đầu tư tài chính",
      url: "https://bocongan.gov.vn/",
      publicationDate: "2023-10-12",
      accessDate: "2026-08-25"
    }
  },
  {
    id: "s6_kidnapping_family",
    title: "Cấp cứu người thân / Bắt cóc",
    targetProfiles: ["family"],
    difficulty: "hard",
    estimatedDuration: "90 - 120 giây",
    learningObjective: "Giữ bình tĩnh khi nghe tin người thân gặp nạn, xác minh chéo trước khi chuyển tiền.",
    initialMessage: "Chào chị! Tôi là giáo viên chủ nhiệm của con chị. Cháu vừa bị tai nạn ở trường đang phải cấp cứu ở bệnh viện Chợ Rẫy. Tình trạng cháu đang nguy kịch cần mổ gấp. Chị chuyển khoản ngay 30 triệu vào tài khoản của bác sĩ khoa cấp cứu (STK: 1234567) để họ tiến hành phẫu thuật. Nhanh lên chị ơi, không kịp mất!",
    groundTruthTactics: ["fear", "urgency", "sympathy"],
    observableCues: [
      "Gây hoảng loạn bằng tin đồn tai nạn cấp cứu",
      "Yêu cầu chuyển tiền gấp để mổ",
      "Cung cấp số tài khoản cá nhân thay vì tài khoản bệnh viện"
    ],
    safeVerificationInstructions: "Khi nhận được thông tin khẩn cấp về người thân, hãy hít thở sâu, tắt máy và lập tức gọi điện thoại xác minh trực tiếp với người thân, nhà trường hoặc bệnh viện.",
    safeResponseScript: "Tôi cần xác minh thông tin. Cho tôi xin số điện thoại trực ban bệnh viện khoa cấp cứu để tôi gọi lại.",
    officialSource: {
      publisher: "Cổng Thông tin điện tử Bộ Công an",
      title: "Khuyến cáo người dân cảnh giác với thủ đoạn lừa đảo 'con đang cấp cứu, chuyển tiền gấp'",
      url: "https://bocongan.gov.vn/",
      publicationDate: "2023-03-09",
      accessDate: "2026-08-25"
    }
  }
];
