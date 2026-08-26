# PHANH! - Dính bẫy giả. Né mất tiền thật.
AI Social-Engineering Flight Simulator for Vietnam. Luyện phản xạ bảo vệ trước các thủ đoạn lừa đảo mạng trong môi trường mô phỏng an toàn.

## Competition Alignment
- Chương trình: AI Riser Vietnam 2026
- Hạng mục: Phòng chống Lừa đảo (Scam and Fraud) + Trò chơi (Game)
- Đề bài: #17 — Trò chơi/website tương tác nâng cao nhận thức cộng đồng.

## Architecture & Data Flow
Ứng dụng được xây dựng với kiến trúc Full-stack TypeScript (React Vite + Express Node.js).
Client gửi quyết định tới Server; Server gọi Gemini API và Firebase Admin để phân tích, đo lường điểm số.

## Google Technologies
- **Gemini API (2.5-flash)**: Đóng vai trò sinh kịch bản lừa đảo phân nhánh an toàn và phân tích văn bản đáng ngờ.
- **Firebase**: Quản lý phiên ẩn danh (Auth), dữ liệu kết quả (Firestore), và đo lường sự kiện (Analytics).
- **Google Safe Browsing V5 (Planned)**: Cảnh báo link độc hại.
- **Cloud Run**: Triển khai frontend và backend trên cùng một container.

## Local Setup
1. `npm install`
2. Tạo `.env` từ `.env.example` và nhập `GEMINI_API_KEY`.
3. `npm run dev`

## Deployment & Tests
Xem `DEPLOYMENT.md` và `TESTING.md`.

## Known Limitations
- Checker hiện tại chưa tự quét URL qua Safe Browsing (mock).
- Chế độ Voice Live chưa được kích hoạt.
