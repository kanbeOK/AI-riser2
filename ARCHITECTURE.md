# Architecture

- Client: React 19, Vite, TypeScript strict, React Router, Lucide và CSS responsive.
- Runtime: reducer thuần quản lý campaign; scheduler xử lý feed/message/deadline idempotently.
- Server: Express phục vụ SPA production và proxy duy nhất tới Google GenAI SDK.
- AI: Gemini 2.5 Flash bổ sung hội thoại tự do; deterministic timeline là đường chạy mặc định an toàn.
- Data: không database và không authentication. Campaign chỉ tồn tại trong memory của tab hiện tại.
- Deploy: một container Cloud Run chạy client bundle và API trên cùng origin.
