// pages/ai.js
import { useState } from "react";

export default function AIPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(e) {
    e && e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMessages(m => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(m => [...m, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setMessages(m => [...m, { role: "assistant", text: "Error: " + err.message }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>AI Assistant</h1>
      <div style={{border:"1px solid #ddd", padding:12, minHeight:200}}>
        {messages.map((m,i)=>(
          <div key={i}><strong>{m.role}:</strong> <div style={{whiteSpace:"pre-wrap"}}>{m.text}</div></div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={{display:"flex", gap:8, marginTop:12}}>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask the AI..." style={{flex:1}} />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
