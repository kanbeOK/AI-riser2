import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CASES } from './src/game/content/cases.js';

const PORT = Number(process.env.PORT || 8080);
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

export function createApp() {
  const app = express();
  
  app.use(express.json({ limit: '1mb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  const TurnRequestSchema = z.object({
    scenarioId: z.string(),
    actionId: z.string().optional(),
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      parts: z.array(z.object({ text: z.string() }))
    })).max(8).optional(),
    userMessage: z.string().max(300).optional()
  });

  function getGemini() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) return null;
    return new GoogleGenAI({ apiKey: key });
  }

  app.post('/api/scenarios/turn', async (req, res) => {
    try {
      const parsed = TurnRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: { code: 400, message: "Invalid request payload", details: parsed.error.issues, retryable: false } });
      }

      const { scenarioId, actionId, history, userMessage } = parsed.data;
      
      const scenario = CASES[scenarioId];
      if (!scenario) {
        return res.status(400).json({ error: { code: 400, message: "Invalid scenario", retryable: false } });
      }

      const aiClient = getGemini();
      if (!aiClient) {
        // Deterministic Fallback
        return res.json({
          message: scenario.initialMessage + " (Tôi đang bận, xin vui lòng làm theo yêu cầu nhanh lên!)",
          tactic: scenario.tactics[0] || "Gây áp lực",
          pressureDelta: 10,
          source: 'deterministic_fallback'
        });
      }

      const chat = aiClient.chats.create({
        model: GEMINI_MODEL,
        config: {
          systemInstruction: `Bạn đang đóng vai kẻ lừa đảo trong một trò chơi mô phỏng giáo dục.
          Kịch bản: ${scenario.title}
          Chiến thuật: ${scenario.tactics.join(", ")}
          Mục tiêu: Đạt được lòng tin hoặc ép buộc nạn nhân.
          Hãy đóng vai thật tự nhiên, không bao giờ thừa nhận mình là kẻ lừa đảo.
          Chỉ trả lời ngắn gọn, dưới 2 câu. Không sử dụng các thông tin thực tế (tên người thật, sđt thật, link thật).
          Trả về đối tượng JSON gồm:
          - message: Lời thoại của bạn.
          - tactic: Tên chiến thuật bạn đang dùng.
          - pressureDelta: Mức độ tăng/giảm áp lực tâm lý (số nguyên từ -20 đến +20).
          - newClueId: (Tùy chọn) Mã bằng chứng mới nếu có (chỉ tạo nếu thực sự cần thiết, dạng text ngắn gọn).`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: "object",
            properties: {
              message: { type: "string" },
              tactic: { type: "string" },
              pressureDelta: { type: "number" },
              newClueId: { type: "string" }
            },
            required: ["message", "tactic", "pressureDelta"]
          }
        },
      });

      try {
        const response = await chat.sendMessage({ message: userMessage || "Bắt đầu" });
        const data = JSON.parse(response.text || '{}');
        res.json({ 
          message: data.message || "Tiếp tục làm theo hướng dẫn của tôi.", 
          tactic: data.tactic || "Thuyết phục",
          pressureDelta: data.pressureDelta || 0,
          newClueId: data.newClueId,
          source: 'gemini' 
        });
      } catch (e) {
        console.error("Gemini Error:", e);
        res.json({ 
          message: "Mạng đang chậm, nhanh tay chuyển khoản hoặc gửi thông tin đi bạn!", 
          tactic: "Ép buộc",
          pressureDelta: 5,
          source: 'deterministic_fallback' 
        });
      }
    } catch (error) {
      res.status(500).json({ error: { code: 500, message: "Internal server error", retryable: true } });
    }
  });

  app.get('/api/health', (req, res) => res.json({ status: "ok" }));
  app.get('/api/healthz', (req, res) => res.json({ status: "ok" }));
  app.get('/api/readiness', (req, res) => res.json({ status: "ready" }));
  app.get('/api/readyz', (req, res) => res.json({ status: "ready" }));

  // API 404 Middleware before SPA fallback
  app.use('/api', (req, res) => {
    res.status(404).json({ error: "API endpoint not found" });
  });

  return app;
}

async function startServer() {
  const app = createApp();
  
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.cjs'))) {
  startServer().catch(console.error);
}
