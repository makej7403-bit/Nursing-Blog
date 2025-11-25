// pages/api/ai/chat.js
import { estimateCost } from "../../../lib/aiCost.js";
const OPENAI_KEY = process.env.OPENAI_API_KEY;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { message, model = "gpt-4o-mini" } = req.body;
  if (!message) return res.status(400).json({ error: "Message required" });
  if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI key not configured" });

  try {
    const body = {
      model,
      messages: [
        { role: "system", content: "You are a concise nursing education assistant." },
        { role: "user", content: message }
      ],
      temperature: 0.2,
      max_tokens: 800
    };

    const r = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });

    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: "OpenAI error", detail: data });

    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || null;
    const costInfo = usage ? estimateCost(usage, model) : null;

    // best-effort log (optional)
    try {
      const { getAdminFirestore } = await import("../../../lib/firebaseAdmin.js");
      const db = getAdminFirestore();
      await db.collection("ai_usage").add({ type: "chat", prompt: message.slice(0,1000), replySnippet: reply.slice(0,1000), usage, costInfo, model, createdAt: new Date() });
    } catch (e) { console.warn("ai usage log failed", e.message); }

    return res.status(200).json({ reply, usage, costInfo });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}
