// pages/api/ai/stream.js
export const config = { api: { responseLimit: false } };
const OPENAI_KEY = process.env.OPENAI_API_KEY;

function extractTextFromData(payload) {
  try {
    const obj = JSON.parse(payload);
    const delta = obj.choices?.[0]?.delta;
    if (delta?.content) return delta.content;
  } catch (e) {}
  return "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { messages, model = "gpt-4o-mini", temperature = 0.2 } = req.body;
  if (!messages || !Array.isArray(messages)) return res.status(400).json({ error: "messages array required" });
  if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI key not configured" });

  res.writeHead(200, { "Content-Type":"text/event-stream", "Cache-Control":"no-cache, no-transform", Connection:"keep-alive" });

  const body = { model, messages, temperature, stream: true };
  try {
    const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type":"application/json" },
      body: JSON.stringify(body)
    });
    if (!openaiRes.ok) {
      const txt = await openaiRes.text();
      res.write(`event: error\ndata: ${JSON.stringify({ status: openaiRes.status, body: txt })}\n\n`);
      return res.end();
    }
    const reader = openaiRes.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop(); // keep partial
      for (const line of lines) {
        const txt = line.trim().startsWith("data:") ? line.trim().slice(5).trim() : line.trim();
        if (!txt || txt === "[DONE]") continue;
        const delta = extractTextFromData(txt);
        if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }
    if (buffer) {
      const txt = buffer.trim();
      if (txt && txt !== "[DONE]") {
        const delta = extractTextFromData(txt);
        if (delta) res.write(`data: ${JSON.stringify({ delta })}\n\n`);
      }
    }
    res.write("event: done\ndata: [DONE]\n\n");
    res.end();
  } catch (err) {
    console.error("stream error", err);
    res.write(`event: error\ndata: ${JSON.stringify({ error: err.message })}\n\n`);
    res.end();
  }
}
