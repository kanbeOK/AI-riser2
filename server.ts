import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { CASES } from './src/game/content/cases.js';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const GEMINI_MODEL = "gemini-2.5-flash";

app.use(express.json({ limit: '1mb' }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

function getGemini() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenAI({ apiKey: key });
}

app.post('/api/scenarios/turn', async (req, res) => {
  try {
    const { scenarioId, actionId, history, userMessage } = req.body;
    
    if (!scenarioId || !CASES[scenarioId]) {
      return res.status(400).json({ error: { code: 400, message: "Invalid scenario", retryable: false } });
    }
    
    if (history && history.length > 8) {
      return res.status(400).json({ error: { code: 400, message: "History too long", retryable: false } });
    }
    
    if (userMessage && userMessage.length > 300) {
      return res.status(400).json({ error: { code: 400, message: "Message too long", retryable: false } });
    }

    const aiClient = getGemini();
    if (!aiClient) {
      return res.json({
        message: "Phản hồi dự phòng (Không có Gemini API).",
        source: 'deterministic_fallback'
      });
    }

    const scenario = CASES[scenarioId];
    
    const chat = aiClient.chats.create({
      model: GEMINI_MODEL,
      config: {
        systemInstruction: `Bạn đang đóng vai kẻ lừa đảo trong một trò chơi mô phỏng giáo dục.
        Kịch bản: ${scenario.title}
        Chiến thuật: ${scenario.tactics.join(", ")}
        Hãy đóng vai thật tự nhiên, không bao giờ thừa nhận mình là kẻ lừa đảo.
        Chỉ trả lời ngắn gọn, dưới 2 câu. Không sử dụng các thông tin thực tế (tên người thật, sđt thật, link thật).`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: "object",
          properties: {
            message: { type: "string" }
          },
          required: ["message"]
        }
      },
    });

    try {
      const response = await chat.sendMessage({ message: userMessage || "Tiếp tục" });
      let data = JSON.parse(response.text || '{}');
      let messageOut = data.message || "Phản hồi mặc định.";
      res.json({ message: messageOut, source: 'gemini' });
    } catch (e) {
      res.json({ message: "Lỗi phản hồi", source: 'deterministic_fallback' });
    }
  } catch (error) {
    res.status(500).json({ error: { code: 500, message: "Internal server error", retryable: true } });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ status: "ok" });
});

app.get('/api/readiness', (req, res) => {
  res.json({ status: "ready" });
});

async function startServer() {
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
  
  if (isNaN(PORT) || PORT <= 0) {
    console.error("Invalid PORT environment variable");
    process.exit(1);
  }
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

if (process.argv[1] && (process.argv[1].endsWith('server.ts') || process.argv[1].endsWith('server.cjs'))) {
  startServer().catch(console.error);
}
