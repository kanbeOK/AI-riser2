# Deployment Guide

Ứng dụng MẮT LƯỚI được tối ưu để triển khai qua Google Cloud Run với một container duy nhất (chứa cả Express Server và tĩnh Vite SPA).

## 1. Yêu cầu hệ thống
- `NODE_ENV=production` (script `npm start` đã tự thiết lập)
- `PORT` (được Cloud Run tự động tiêm vào, mặc định 8080)
- `GEMINI_API_KEY` (tùy chọn; nên lưu trong Secret Manager)
- Google Cloud Artifact Registry đã được kích hoạt.

## 2. Kiểm tra trước khi triển khai (Local Verification)
Đảm bảo mã nguồn vượt qua toàn bộ Typecheck, Test và Build:
\`\`\`bash
npm run verify
PORT=8080 npm start
\`\`\`
Kiểm tra endpoint sức khỏe:
\`\`\`bash
curl -f http://127.0.0.1:8080/api/healthz
curl -f http://127.0.0.1:8080/api/readyz
\`\`\`

## 3. Triển khai lên Google Cloud
Sử dụng Artifact Registry (khuyên dùng) thay cho Container Registry (GCR):

\`\`\`bash
export PROJECT_ID="your-gcp-project-id"
export REGION="asia-southeast1"

# Build và đẩy image lên Artifact Registry
gcloud builds submit --tag $REGION-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/phanh-ai

# Triển khai lên Cloud Run
gcloud run deploy phanh-ai \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/cloud-run-source-deploy/phanh-ai \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --set-env-vars="NODE_ENV=production" \
  --set-secrets="GEMINI_API_KEY=gemini-api-key:latest"
\`\`\`
