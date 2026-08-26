import 'dotenv/config';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { SCENARIOS } from './src/game/content/scenarios.js';

const PORT = Number(process.env.PORT || 8080);
const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

type CreateAppOptions = {
  geminiApiKey?: string | null;
};

const TurnResponseSchema = z.object({
  message: z.string().trim().min(1).max(360),
  tactic: z.string().trim().min(1).max(80),
  pressureDelta: z.number().int().min(-20).max(20),
  clueKey: z.string().optional(),
});

export function createApp(options: CreateAppOptions = {}) {
  const app = express();
  
  app.use(express.json({ limit: '1mb' }));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

  const TurnRequestSchema = z.object({
    scenarioId: z.string(),
    actionId: z.string().optional(),
    history: z.array(z.object({
      role: z.enum(['user', 'model']),
      parts: z.array(z.object({ text: z.string().max(500) })).min(1).max(1)
    })).max(8).optional(),
    userMessage: z.string().max(300).optional()
  });

  function getGemini() {
    const key = options.geminiApiKey === undefined
      ? process.env.GEMINI_API_KEY
      : options.geminiApiKey;
    if (!key) return null;
    return new GoogleGenAI({ apiKey: key });
  }

  function normalizeHistory(history: z.infer<typeof TurnRequestSchema>["history"]) {
    if (!history) return [];
    const merged: NonNullable<z.infer<typeof TurnRequestSchema>["history"]> = [];

    history.forEach((turn) => {
      const text = turn.parts[0]?.text.trim();
      if (!text) return;
      const previous = merged.at(-1);
      if (previous?.role === turn.role) {
        previous.parts[0] = { text: `${previous.parts[0]?.text ?? ""}\n${text}`.slice(0, 500) };
      } else {
        merged.push({ role: turn.role, parts: [{ text }] });
      }
    });

    while (merged[0]?.role === "model") merged.shift();
    if (merged.at(-1)?.role === "user") merged.pop();
    return merged.slice(-8);
  }

  app.post('/api/scenarios/turn', async (req, res) => {
    try {
      const parsed = TurnRequestSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ error: { code: 400, message: "Invalid request payload", details: parsed.error.issues, retryable: false } });
      }

      const { scenarioId, history, userMessage } = parsed.data;
      
      const scenario = SCENARIOS[scenarioId];
      if (!scenario) {
        return res.status(400).json({ error: { code: 400, message: "Invalid scenario", retryable: false } });
      }

      const aiClient = getGemini();
      
      if (!aiClient) {
        // Deterministic Fallback
        const fallbackBeat = scenario.beats[0];
        return res.json({
          message: fallbackBeat ? fallbackBeat.text : "Tôi đang bận, xin vui lòng làm theo yêu cầu nhanh lên!",
          tactic: scenario.tactics[0] || "Xác minh minh bạch",
          pressureDelta: scenario.isScam ? 10 : -6,
          clues: fallbackBeat ? fallbackBeat.clues : [],
          source: 'deterministic_fallback'
        });
      }

      const allowedClues = Object.keys(scenario.evidenceBase);
      const roleInstruction = scenario.isScam
        ? `Bạn đang đóng vai nguồn lừa đảo hư cấu trong một trò chơi mô phỏng giáo dục.
          Mục tiêu trong vai: tìm cách tạo lòng tin hoặc gây áp lực, nhưng không bao giờ cung cấp hướng dẫn phạm pháp có thể áp dụng ngoài đời.`
        : `Bạn đang đóng vai một nguồn giao hàng hợp pháp hư cấu trong trò chơi mô phỏng giáo dục.
          Mục tiêu trong vai: trả lời minh bạch, khuyến khích người dùng kiểm tra qua ứng dụng chính thức và không tạo áp lực.`;

      const chat = aiClient.chats.create({
        model: GEMINI_MODEL,
        history: normalizeHistory(history),
        config: {
          systemInstruction: `${roleInstruction}
          Kịch bản: ${scenario.title}
          Chiến thuật: ${scenario.tactics.join(", ")}
          Hãy đóng vai tự nhiên và chỉ trả lời ngắn gọn, dưới 2 câu. Không sử dụng tên người thật, số điện thoại thật, domain thật, tài khoản thật hoặc đường dẫn có thể truy cập.
          Trả về đối tượng JSON gồm:
          - message: Lời thoại của bạn.
          - tactic: Tên chiến thuật bạn đang dùng.
          - pressureDelta: Mức độ tăng/giảm áp lực tâm lý (số nguyên từ -20 đến +20).
          - clueKey: (Tùy chọn) Chọn MỘT mã bằng chứng hợp lệ từ danh sách sau nếu phù hợp với ngữ cảnh: ${allowedClues.join(", ")}`,
          responseMimeType: 'application/json',
          responseSchema: {
            type: "object",
            properties: {
              message: { type: "string" },
              tactic: { type: "string" },
              pressureDelta: { type: "number" },
              clueKey: { type: "string" }
            },
            required: ["message", "tactic", "pressureDelta"]
          }
        },
      });

      try {
        const response = await chat.sendMessage({ message: userMessage || "Bắt đầu" });
        const parsedResponse = TurnResponseSchema.safeParse(JSON.parse(response.text || '{}'));
        if (!parsedResponse.success) throw new Error("Gemini returned an invalid turn payload");
        const data = parsedResponse.data;
        
        let validClueKey = undefined;
        if (data.clueKey && allowedClues.includes(data.clueKey)) {
          validClueKey = data.clueKey;
        }

        res.json({ 
          message: data.message,
          tactic: data.tactic,
          pressureDelta: data.pressureDelta,
          clues: validClueKey ? [validClueKey] : [],
          source: 'gemini' 
        });
      } catch (e) {
        console.error("Gemini Error:", e);
        const fallbackBeat = scenario.beats[0];
        res.json({ 
          message: fallbackBeat ? fallbackBeat.text : "Kênh mô phỏng đang chuyển sang timeline dự phòng.",
          tactic: scenario.tactics[0] || "Xác minh minh bạch",
          pressureDelta: scenario.isScam ? 5 : -4,
          clues: fallbackBeat ? fallbackBeat.clues : [],
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
