# Deployment Guide

1. Đảm bảo cấu hình biến môi trường trên Secret Manager.
2. Build container từ Dockerfile:
   `gcloud builds submit --tag gcr.io/PROJECT_ID/phanh-ai`
3. Triển khai lên Cloud Run:
   `gcloud run deploy phanh-ai --image gcr.io/PROJECT_ID/phanh-ai --platform managed --region asia-southeast1 --allow-unauthenticated`
