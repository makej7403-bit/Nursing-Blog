// pages/admin.js
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

export default function AdminPage({ user }) {
  const [allowed, setAllowed] = useState(false);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filePath, setFilePath] = useState("");
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    if (!user) return setAllowed(false);
    const adminUid = process.env.NEXT_PUBLIC_ADMIN_UID;
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    if ((adminUid && user.uid === adminUid) || (adminEmail && user.email === adminEmail)) {
      setAllowed(true);
      loadLogs(user);
    } else {
      setAllowed(false);
      setLoading(false);
    }
  }, [user]);

  async function loadLogs(user) {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('uid', user.uid || '');
      params.set('email', user.email || '');
      const res = await fetch('/api/admin/logs?' + params.toString());
      const data = await res.json();
      if (res.ok) setLogs(data.rows || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSummarize() {
    setSummary(null);
    const res = await fetch('/api/ai/summarize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filePath, requestor: user?.email })
    });
    const data = await res.json();
    if (res.ok) setSummary(data.summary);
    else setSummary('Error: ' + (data.error || JSON.stringify(data)));
  }

  if (!user) return <div>Please sign in as admin.</div>;
  if (!allowed) return <div>Access denied. You are not an admin.</div>;

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <section>
        <h2>Summarize storage file</h2>
        <input value={filePath} onChange={e=>setFilePath(e.target.value)} placeholder="uploads/<uid>/<file.pdf>" style={{width:"100%", marginBottom:8}} />
        <button onClick={handleSummarize}>Summarize</button>
        {summary && <div style={{whiteSpace:"pre-wrap", marginTop:12}}>{summary}</div>}
      </section>

      <section>
        <h2>Recent AI usage</h2>
        {loading ? <p>Loading…</p> : (
          <table><thead><tr><th>Type</th><th>file</th><th>user</th><th>time</th></tr></thead>
            <tbody>
              {logs.map(l=>(
                <tr key={l.id}><td>{l.type}</td><td style={{fontFamily:'monospace'}}>{l.filePath||l.fileUrl||'-'}</td><td>{l.requestor||l.userId||'-'}</td><td>{l.createdAt?.toDate ? l.createdAt.toDate().toLocaleString():l.createdAt}</td></tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
