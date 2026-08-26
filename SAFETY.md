# Safety

- System instruction giới hạn Gemini trong vai trò mô phỏng giáo dục, câu trả lời ngắn và không cung cấp hướng dẫn phạm pháp có thể áp dụng ngoài đời.
- Output Gemini phải qua schema và clue allowlist; payload sai tự động chuyển sang deterministic fallback.
- Mọi URL dùng TLD `.test`; số điện thoại, tài khoản, certificate và QR đều là token mô phỏng.
- Bằng chứng chỉ được nhận nếu đã xuất hiện trong feed ground truth. Liên kết graph chỉ hợp lệ sau OSINT và khi hai node thực sự có quan hệ.
- Một vụ hợp pháp được cố ý đưa vào để dạy người chơi tránh false positive.
