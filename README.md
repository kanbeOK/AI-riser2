# MẮT LƯỚI — Ca trực 03

Game điều tra chống lừa đảo dành cho AI Riser Vietnam 2026. Người chơi là một điều tra viên từ xa: theo dõi hai tín hiệu song song, niêm phong manh mối, tra cứu OSINT, nối các node kỹ thuật và chọn mức can thiệp trước khi nạn nhân chuyển tiền.

Đây không phải trang trắc nghiệm. Vòng lặp chính kéo dài ba đêm và buộc người chơi cân bằng cả công việc lẫn đời sống: tiền nhà, internet, thức ăn, năng lượng và việc làm thêm đều tác động tới khả năng điều tra.

## Competition alignment

- Đề bài #17 — trò chơi/website tương tác nâng cao nhận thức cộng đồng.
- Chủ đề: phòng chống lừa đảo và gian lận số tại Việt Nam.
- Sáu vụ án hư cấu: giả shipper, shipper hợp pháp dễ bị báo nhầm, cộng tác viên hoa hồng, giả tổng đài ngân hàng, cuộc gọi khẩn cấp và hoàn học phí giả.
- Mọi domain dùng TLD `.test`; số điện thoại, tài khoản và danh tính đều là dữ liệu mô phỏng.

## Vòng lặp gameplay

1. Nhận briefing tại căn hộ và vào ca trực lúc 19:00.
2. Theo dõi hai feed chạy đồng thời; thời gian tiếp tục trôi khi mở công cụ điều tra.
3. Niêm phong bằng chứng chỉ sau khi nó thực sự xuất hiện trong feed.
4. Dùng OSINT để xác minh, sau đó nối đúng các quan hệ kỹ thuật trên graph.
5. Cảnh báo, đóng băng, chuyển hồ sơ hoặc xác nhận tín hiệu hợp pháp. Báo nhầm bị phạt.
6. Trở về căn hộ, làm thêm, ăn, thanh toán internet/tiền nhà và ngủ sang đêm mới.

## Kiến trúc

- React 19 + TypeScript + Vite cho client.
- Reducer thuần và scheduler deterministic cho toàn bộ state machine ba ngày.
- Express phục vụ SPA và `/api/scenarios/turn`.
- Gemini 2.5 Flash chỉ bổ sung hội thoại tự do. Không có khóa hoặc khi API lỗi, timeline deterministic vẫn đảm bảo game chơi trọn vẹn.
- Không Firebase, không database, không thu thập dữ liệu cá nhân và không đưa API key xuống client.

## Chạy local

```bash
npm ci
npm run dev
```

Mở `http://localhost:8080`. `GEMINI_API_KEY` là tùy chọn; xem `.env.example`.

## Kiểm thử và production

```bash
npm run verify
npm start
```

`verify` chạy typecheck, 24 bài unit/integration/click-path, production build và kiểm tra CSS đã bundle. Dockerfile triển khai frontend + backend trong một container Cloud Run. Hướng dẫn chi tiết nằm trong `DEPLOYMENT.md`.
