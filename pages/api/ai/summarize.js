// pages/api/ai/summarize.js
import { getAdminStorage, getAdminFirestore } from "../../lib/firebaseAdmin.js";
import pdf from "pdf-parse";
import { estimateCost } from "../../lib/aiCost.js";
const OPENAI_KEY = process.env.OPENAI_API_KEY;

async function callOpenAI(prompt, max_tokens=800, model="gpt-4o-mini") {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${OPENAI_KEY}`, "Content-Type":"application/json" },
    body: JSON.stringify({ model, messages: [{ role:"system", content:"You are a concise nursing education assistant." }, { role:"user", content: prompt }], max_tokens })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { filePath, fileUrl, requestor } = req.body;
  if (!filePath && !fileUrl) return res.status(400).json({ error: "filePath or fileUrl required" });
  if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI key not configured" });

  try {
    let text = "";
    if (filePath) {
      const bucket = getAdminStorage();
      const [buffer] = await bucket.file(filePath).download();
      try {
        const pdfData = await pdf(buffer);
        text = pdfData.text || "";
      } catch(e) {
        text = buffer.toString("utf8").slice(0, 50000);
      }
    } else {
      const r = await fetch(fileUrl);
      if (!r.ok) throw new Error("Could not fetch file URL");
      const buf = Buffer.from(await r.arrayBuffer());
      try { text = (await pdf(buf)).text || ""; } catch(e) { text = buf.toString("utf8").slice(0,50000); }
    }
    if (!text || text.trim().length < 20) return res.status(400).json({ error: "No extractable text. Use OCR." });

    const truncated = text.length > 24000 ? text.slice(0,24000) : text;
    const prompt = `Summarize the following nursing document into:
1) 6–10 bullet point key facts or steps
2) 3 practical clinical tips
3) 1 short study checklist

Document:
${truncated}

If the document is longer, mention that the summary is partial.`;

    const data = await callOpenAI(prompt);
    const reply = data.choices?.[0]?.message?.content || "";
    const usage = data.usage || null;
    const costInfo = usage ? estimateCost(usage, "gpt-4o-mini") : null;

    try {
      const db = getAdminFirestore();
      await db.collection("ai_usage").add({ type:"summarize", filePath: filePath || null, fileUrl: fileUrl || null, requestor: requestor || null, usage, costInfo, createdAt: new Date() });
    } catch(e) { console.warn("log failed", e.message); }

    return res.status(200).json({ summary: reply, usage, costInfo });
  } catch (err) {
    console.error("summarize error", err);
    return res.status(500).json({ error: err.message });
  }
}
