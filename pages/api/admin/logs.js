// pages/api/admin/logs.js
import { getAdminFirestore } from "../../../lib/firebaseAdmin.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  const uid = req.query.uid || null;
  const email = req.query.email || null;
  if (!((adminUid && uid === adminUid) || (adminEmail && email === adminEmail))) return res.status(403).json({ error: "Forbidden" });

  try {
    const db = getAdminFirestore();
    const snap = await db.collection("ai_usage").orderBy("createdAt", "desc").limit(200).get();
    const rows = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    return res.status(200).json({ rows });
  } catch (err) {
    console.error("admin logs error", err);
    return res.status(500).json({ error: err.message });
  }
}
