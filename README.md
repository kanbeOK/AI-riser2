# PHANH! - Dính bẫy giả. Né mất tiền thật.

AI Social-Engineering Simulator cho Việt Nam. Luyện phản xạ bảo vệ bản thân và người thân trước các thủ đoạn lừa đảo mạng trong môi trường mô phỏng an toàn.

## Competition Alignment
- Chương trình: AI Riser Vietnam 2026
- Hạng mục: Phòng chống Lừa đảo (Scam and Fraud) + Trò chơi (Game)
- Đề bài: #17 — Trò chơi/website tương tác nâng cao nhận thức cộng đồng.

## Architecture & Data Flow
Ứng dụng được xây dựng với kiến trúc Full-stack TypeScript (React Vite + Express Node.js).
Client gửi quyết định tới Server; Server gọi Gemini API phân tích và tạo kịch bản lừa đảo phân nhánh.

**Privacy Boundary:** Toàn bộ quá trình kiểm tra tin nhắn và tương tác giả lập được thực hiện mà KHÔNG lưu trữ nội dung tin nhắn thật của người dùng. "Reflex Score" được tính toán trên trình duyệt (localStorage) để đảm bảo tính ẩn danh 100%. Firebase Analytics/Firestore đã được lược bỏ khỏi P0 để tránh các cam kết sai sự thật.

## Google Technologies
- **Gemini API (2.5-flash)**: Đóng vai trò sinh kịch bản lừa đảo phân nhánh an toàn (với Deterministic fallback khi lỗi/quá tải) và là lõi của công cụ "Kiểm tra tin nhắn" (Checker).
- **Google Safe Browsing V5 (Planned)**: Cảnh báo link độc hại (hiện đang trả về chưa kiểm tra nếu thiếu API Key).
- **Cloud Run**: Triển khai frontend và backend trên cùng một container.

## Local Setup
1. `npm install`
2. Tạo `.env` chứa `GEMINI_API_KEY`.
3. `npm run dev`

Nếu không có API Key, hệ thống vẫn sẽ hoạt động nhờ các luồng kịch bản Deterministic Fallback.

## Deployment & Tests
Xem `DEPLOYMENT.md`.

## Known Limitations
- Checker hiện tại sẽ báo "Chưa kiểm tra danh tiếng đường dẫn" nếu không cung cấp khóa Google Safe Browsing API.
- Chế độ tải ảnh của Checker đã được loại bỏ để đảm bảo phân tích văn bản sâu sát và tối ưu nhất cho P0.
- Điểm "Tiến bộ của bạn" hiện chỉ tính dựa trên dữ liệu lưu trữ nội bộ (localStorage). Không sử dụng cơ sở dữ liệu bên ngoài.
