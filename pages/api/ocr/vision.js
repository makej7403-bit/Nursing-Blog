// pages/api/ocr/vision.js
import { getAdminStorage } from "../../../lib/firebaseAdmin.js";
import fs from "fs";
import os from "os";
import path from "path";
import { execFile } from "child_process";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const { filePath, fileUrl } = req.body;
  if (!filePath && !fileUrl) return res.status(400).json({ error: "filePath or fileUrl required" });

  const VISION_KEY = process.env.VISION_API_KEY;
  try {
    let buffer;
    if (filePath) {
      const bucket = getAdminStorage();
      const [buf] = await bucket.file(filePath).download();
      buffer = buf;
    } else {
      const r = await fetch(fileUrl);
      if (!r.ok) return res.status(400).json({ error: "Could not fetch fileUrl" });
      buffer = Buffer.from(await r.arrayBuffer());
    }

    if (VISION_KEY) {
      const contentBase64 = buffer.toString("base64");
      const visionReq = { requests: [{ image: { content: contentBase64 }, features: [{ type: "DOCUMENT_TEXT_DETECTION" }] }] };
      const visionRes = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${VISION_KEY}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(visionReq) });
      const data = await visionRes.json();
      return res.status(200).json({ ocr: data });
    } else {
      // Tesseract fallback (server must have tesseract)
      const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "ocr-"));
      const imgPath = path.join(tmp, "input");
      fs.writeFileSync(imgPath, buffer);
      const outPath = path.join(tmp, "out");
      try {
        await new Promise((resolve, reject) => execFile("tesseract", [imgPath, outPath], (err) => err ? reject(err) : resolve()));
        const text = fs.readFileSync(outPath + ".txt", "utf8");
        try { fs.rmSync(tmp, { recursive:true }); } catch(e) {}
        return res.status(200).json({ ocr: { text } });
      } catch (err) {
        try { fs.rmSync(tmp, { recursive:true }); } catch(e) {}
        return res.status(500).json({ error: "Tesseract failed or not available", detail: err.message });
      }
    }
  } catch (err) {
    console.error("OCR error", err);
    return res.status(500).json({ error: err.message });
  }
}
