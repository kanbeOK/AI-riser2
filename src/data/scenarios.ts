export type Scenario = {
  id: string;
  title: string;
  targetProfiles: string[];
  difficulty: number;
  learningObjective: string;
  initialMessage: {
    sender: string;
    channel: "sms" | "chat" | "email";
    text: string;
  };
  groundTruth: {
    isScam: boolean;
    tactics: string[];
    cues: string[];
  };
  debrief: {
    explanation: string;
    saferPath: string;
    actionScript: string;
  };
};

export const SEED_SCENARIOS: Scenario[] = [
  {
    id: "s1_fake_delivery",
    title: "Đơn hàng hoàn tiền bằng QR",
    targetProfiles: ["Người mua bán online", "Sinh viên / người mới đi làm"],
    difficulty: 1,
    learningObjective: "Nhận biết bẫy quét mã QR để nhận tiền hoàn, hiểu rằng QR chỉ dùng để CHUYỂN tiền đi.",
    initialMessage: {
      sender: "GHTK-Express (090x.xxx.xxx)",
      channel: "sms",
      text: "Khach hang co don hang 0d bi hoan tra. Vui long quet ma QR trong Zalo đe nhan lai phi bao hiem don hang 50,000 VND. Lien he NV Giao Hang: zalo.me/fake-link",
    },
    groundTruth: {
      isScam: true,
      tactics: ["urgency", "reward", "channel_mismatch"],
      cues: ["Số cá nhân giả mạo tổng đài", "Yêu cầu quét QR để NHẬN tiền", "Link Zalo không chính thức"],
    },
    debrief: {
      explanation: "Kẻ gian lợi dụng tâm lý tiếc tiền để lừa bạn quét mã QR. Mã QR này thực chất là lệnh CHUYỂN TIỀN, không phải nhận tiền.",
      saferPath: "Kiểm tra app giao hàng chính thức xem có đơn hàng nào bị hủy không. Tuyệt đối không quét mã QR từ người lạ.",
      actionScript: "Tôi sẽ tự kiểm tra trên app giao hàng. Đừng gửi mã QR cho tôi.",
    }
  },
  {
    id: "s2_fake_police",
    title: "Giả danh công an, gây áp lực",
    targetProfiles: ["Gia đình / người lớn tuổi", "Nhân viên văn phòng / chủ hộ kinh doanh"],
    difficulty: 2,
    learningObjective: "Nhận biết chiến thuật dọa nạt, yêu cầu bảo mật thông tin và nhận ra Công an không làm việc qua điện thoại/Zalo.",
    initialMessage: {
      sender: "Cán bộ điều tra Lê Văn A",
      channel: "chat",
      text: "Tôi là cán bộ phòng chống tội phạm công nghệ cao. Tài khoản của anh/chị đang liên quan đến đường dây rửa tiền xuyên quốc gia. Yêu cầu tải app bảo mật nội bộ và chuyển tiền vào tài khoản tạm giữ để xác minh. Phải giữ bí mật tuyệt đối, nếu không sẽ bị bắt ngay lập tức.",
    },
    groundTruth: {
      isScam: true,
      tactics: ["authority", "fear", "isolation"],
      cues: ["Tự xưng Công an làm việc qua chat", "Yêu cầu chuyển tiền vào 'tài khoản tạm giữ'", "Dọa nạt, yêu cầu giữ bí mật (cô lập)"],
    },
    debrief: {
      explanation: "Kẻ gian giả danh cơ quan chức năng để tạo sự sợ hãi (fear) và cô lập (isolation) nạn nhân khỏi gia đình để dễ dàng thao túng.",
      saferPath: "Công an không bao giờ làm việc qua điện thoại hay Zalo, và không có 'tài khoản tạm giữ'. Cúp máy và báo cho người thân.",
      actionScript: "Mời gửi giấy triệu tập về công an phường nơi tôi cư trú. Tôi không làm việc qua mạng.",
    }
  }
];
