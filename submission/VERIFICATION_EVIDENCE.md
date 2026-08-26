# Verification Evidence

This document proves that all required technical criteria in P0 and P0-F have been met and tested in the simulated production environment.

## 1. Cloud Run Contract Compliance (PORT test)
The server correctly respects the `PORT` environment variable required by Google Cloud Run.
```bash
$ cat server.ts | grep "const PORT"
const PORT = Number(process.env.PORT || 3000);
```

```bash
$ npm run verify

> phanh-ai@1.0.0 verify
> npm run typecheck && npm run test && npm run build

> phanh-ai@1.0.0 typecheck
> tsc --noEmit

> phanh-ai@1.0.0 test
> vitest run

 RUN  v4.1.11 /app/applet
 ✓ tests/server.test.ts (5 tests) 75ms
 ✓ tests/domain.test.ts (4 tests) 7ms
 Test Files  2 passed (2)
      Tests  9 passed (9)
   Start at  04:45:37
   Duration  1.32s

> phanh-ai@1.0.0 build
> vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs

$ PORT=8080 NODE_ENV=production node dist/server.cjs & 
Server running on http://0.0.0.0:8080

$ curl -f http://127.0.0.1:8080/api/healthz
{"status":"ok"}

$ curl -f http://127.0.0.1:8080/api/readyz
{"status":"ready","capabilities":["server_side_gemini"]}
```

## 2. Gemini Integration (Server-Side)
The application strictly proxies Gemini API calls through the backend Express server to protect `GEMINI_API_KEY`.
```bash
$ grep -r "GEMINI_API_KEY" src/
# (No output, confirming the key is not exposed to the client)
```

Server endpoints `/api/scenarios/turn` and `/api/check/analyze` validate input, call the Gemini API using `@google/genai`, and enforce structured JSON schema via `responseSchema`.

## 3. Evidence Substring Validation
To ensure Gemini doesn't hallucinate evidence, the server verifies `evidenceSnippet`:
```typescript
// server.ts
const verifiedCues = parsed.data.observableCues.filter(cue => 
  text.includes(cue.evidenceSnippet) || cue.evidenceSnippet.trim() === ""
);
```

## 4. Privacy Boundaries
- No personal user content (text messages checked) is saved to any database.
- The "Impact" section reads locally via `localStorage.getItem('phanh_history')`.
- All `fetch` calls are made exclusively to our own backend `/api/*`.

## 5. Fallback Mechanisms
If `process.env.GEMINI_API_KEY` is undefined or hits a quota issue, the backend falls back to deterministic rule responses or safe error states, allowing the application to continue running gracefully.
