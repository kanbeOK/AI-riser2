# Testing

Chạy toàn bộ cổng kiểm tra trước khi push:

```bash
npm run verify
```

Lệnh này bao gồm:

- TypeScript strict (`noImplicitAny`, `noUncheckedIndexedAccess`).
- Unit tests cho scheduler, deadline, economy, evidence, OSINT, graph, false positive và ending ba ngày.
- Click-path bằng DOM thật cho demo và solo; không mock reducer/game engine.
- Supertest cho health, validation, deterministic fallback và API 404.
- Production bundle và kiểm tra các selector UI chủ chốt đã tồn tại trong CSS output.
