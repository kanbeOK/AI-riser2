import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/healthz", (req, res) => {
    res.json({ status: "ok" });
  });
  
  app.get("/api/readyz", (req, res) => {
    res.json({ status: "ready" });
  });

  // Mock API routes for early phases
  app.post("/api/scenarios/start", (req, res) => {
    res.json({ attemptId: "mock-attempt-123", scenarioId: req.body.scenarioId });
  });

  const ScamAnalysisSchema = z.object({
    riskLevel: z.enum(["high", "suspicious", "insufficient", "few_clear_signs"]),
    confidenceBand: z.enum(["low", "medium", "high"]),
    verdict: z.string(),
    observableCues: z.array(
      z.object({
        label: z.string(),
        evidenceSnippet: z.string(),
        explanation: z.string(),
      })
    ),
    extractedBrowserUrls: z.array(z.string()),
    unknowns: z.array(z.string()),
    recommendedActions: z.array(z.string()),
    disclaimer: z.string(),
  });

  app.post("/api/check/analyze", async (req, res) => {
    try {
      const { text } = req.body;
      if (!text) {
        return res.status(400).json({ error: "Text is required" });
      }

      if (!process.env.GEMINI_API_KEY) {
        // Fallback if no key
        return res.json({
          riskLevel: "suspicious",
          confidenceBand: "low",
          verdict: "Chưa cấu hình API Key. Hệ thống đang dùng dữ liệu giả lập.",
          observableCues: [],
          extractedBrowserUrls: [],
          unknowns: [],
          recommendedActions: ["Dừng lại", "Xác minh"],
          disclaimer: "Phân tích tự động, không phải bằng chứng pháp lý."
        });
      }

      const prompt = `Phân tích đoạn tin nhắn sau để tìm dấu hiệu lừa đảo:
"${text}"
Phân tách dữ kiện rõ ràng, không bịa đặt chứng cứ. Nếu có đường link, hãy trích xuất chúng.`;

      const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              riskLevel: { type: "string", enum: ["high", "suspicious", "insufficient", "few_clear_signs"] },
              confidenceBand: { type: "string", enum: ["low", "medium", "high"] },
              verdict: { type: "string" },
              observableCues: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    label: { type: "string" },
                    evidenceSnippet: { type: "string" },
                    explanation: { type: "string" },
                  },
                  required: ["label", "evidenceSnippet", "explanation"]
                }
              },
              extractedBrowserUrls: { type: "array", items: { type: "string" } },
              unknowns: { type: "array", items: { type: "string" } },
              recommendedActions: { type: "array", items: { type: "string" } },
              disclaimer: { type: "string" },
            },
            required: ["riskLevel", "confidenceBand", "verdict", "observableCues", "extractedBrowserUrls", "unknowns", "recommendedActions", "disclaimer"]
          }
        }
      });

      let data;
      try {
        data = JSON.parse(response.text || "{}");
      } catch(e) {
        data = {};
      }
      
      const parsed = ScamAnalysisSchema.safeParse(data);
      if (parsed.success) {
        res.json(parsed.data);
      } else {
        res.status(500).json({ error: "Invalid response format from AI" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: "Failed to analyze" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // For Express 4
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
