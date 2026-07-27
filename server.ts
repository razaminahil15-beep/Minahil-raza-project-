import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// API Health Endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Symptom Checker Endpoint
app.post("/api/ai/symptom-check", async (req, res) => {
  try {
    const { symptoms, duration, age, gender } = req.body;
    if (!symptoms) {
      return res.status(400).json({ error: "Symptoms description is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Intelligent fallback when GEMINI_API_KEY is not configured
      const lower = symptoms.toLowerCase();
      let priority = "Medium";
      let department = "General Medicine";
      let waitTime = "15-20 mins";
      let confidence = 92;
      let summary = "Based on reported symptoms, a general evaluation is recommended.";

      if (lower.includes("chest") || lower.includes("heart") || lower.includes("breathing") || lower.includes("faint")) {
        priority = "Critical";
        department = "Emergency & Cardiology";
        waitTime = "Immediate (0 mins)";
        confidence = 98;
        summary = "CRITICAL: Potential cardiac or severe respiratory indicator. Immediate emergency care advised.";
      } else if (lower.includes("fever") || lower.includes("headache") || lower.includes("migraine")) {
        priority = "High";
        department = "Internal Medicine / Neurology";
        waitTime = "10 mins";
        confidence = 94;
        summary = "High-priority evaluation suggested to rule out acute infectious or neurological causes.";
      } else if (lower.includes("bone") || lower.includes("joint") || lower.includes("fracture") || lower.includes("pain")) {
        priority = "Medium";
        department = "Orthopedics & Trauma";
        waitTime = "15 mins";
        confidence = 91;
        summary = "Skeletal/musculoskeletal complaint detected. Recommended for X-Ray and orthopedic review.";
      } else if (lower.includes("skin") || lower.includes("rash") || lower.includes("itch")) {
        priority = "Low";
        department = "Dermatology";
        waitTime = "25 mins";
        confidence = 89;
        summary = "Dermatological symptom pattern. Non-urgent specialist consultation recommended.";
      }

      return res.json({
        priority,
        department,
        estimatedTime: waitTime,
        confidence,
        summary,
        recommendedDoctorType: `${department} Specialist`,
        suggestedActions: [
          "Check in via QR code at triage counter 2",
          "Monitor vitals at automated kiosk",
          "Stay hydrated and remain seated in waiting pod A3"
        ],
        isDemoFallback: true,
      });
    }

    const prompt = `Analyze these symptoms for a hospital smart queue triage system:
Symptoms: ${symptoms}
Duration: ${duration || "Not specified"}
Patient details: Age ${age || "Adult"}, ${gender || "Unspecified"}

Provide a structured JSON output with fields:
- priority: "Low", "Medium", "High", or "Critical"
- department: Hospital department name (e.g. Cardiology, Emergency, General Medicine, Orthopedics, Neurology, Pediatrics, Dermatology)
- estimatedTime: e.g. "10 mins", "15 mins", "Immediate"
- confidence: integer percentage (80 to 99)
- summary: concise clinical summary (1-2 sentences)
- recommendedDoctorType: e.g. "Senior Cardiologist"
- suggestedActions: array of 3 actionable steps for the patient`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING },
            department: { type: Type.STRING },
            estimatedTime: { type: Type.STRING },
            confidence: { type: Type.INTEGER },
            summary: { type: Type.STRING },
            recommendedDoctorType: { type: Type.STRING },
            suggestedActions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ["priority", "department", "estimatedTime", "confidence", "summary", "recommendedDoctorType", "suggestedActions"],
        },
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Symptom check error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze symptoms." });
  }
});

// AI Chatbot Assistant Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history, assistantName } = req.body;
    const name = assistantName || "MediFlow AI";
    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const ai = getGeminiClient();
    if (!ai) {
      // Fallback response generator
      const lower = message.toLowerCase();
      let reply = `I am ${name}, your smart hospital assistant. How can I help you today?`;
      if (lower.includes("appointment") || lower.includes("book") || lower.includes("doctor")) {
        reply = "I can help you find the best doctor with the shortest wait time! You can use Screen 4 (Smart Appointment Booking) to view doctor slots or ask me which department you need.";
      } else if (lower.includes("queue") || lower.includes("wait") || lower.includes("time")) {
        reply = "Our AI predictive queue currently estimates an average wait time of 12 minutes. Check Screen 5 (Live Queue Tracker) to see real-time updates and patients ahead of you.";
      } else if (lower.includes("prescription") || lower.includes("medicine") || lower.includes("pill")) {
        reply = "Your prescriptions are safely synced in Screen 6 (Digital Health Wallet). Remember to take Amoxicillin 500mg after dinner at 8:00 PM.";
      } else if (lower.includes("diet") || lower.includes("food") || lower.includes("nutrition")) {
        reply = "For post-consultation recovery, maintain high hydration (2.5L water daily), consume anti-inflammatory foods like berries, leafy greens, and lean proteins, and avoid high-sodium processed meals.";
      }

      return res.json({ reply, isDemoFallback: true });
    }

    const formattedHistory = (history || []).map((item: any) => `${item.sender === "user" ? "User" : name}: ${item.text}`).join("\n");

    const systemInstruction = `You are ${name}, an advanced 2026 smart hospital assistant created for the MediFlow AI platform. 
You are empathetic, clinical yet accessible, highly structured, and concise.
You help users with health inquiries, medicine reminders, appointment booking advice, queue tracking guidance, diet suggestions, and post-treatment guidance. Always introduce yourself or respond naturally as ${name}. Always encourage consulting a certified healthcare professional for medical emergencies. Keep responses short and well-formatted with markdown or bullet points where relevant.`;

    const fullPrompt = `${formattedHistory ? `Conversation history:\n${formattedHistory}\n\n` : ""}User: ${message}\n${name}:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
      config: {
        systemInstruction,
      },
    });

    res.json({ reply: response.text });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI chat response." });
  }
});

// Start Express server with Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediFlow AI Server running on http://localhost:${PORT}`);
  });
}

startServer();
