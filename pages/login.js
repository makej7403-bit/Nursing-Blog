// pages/login.js
import { useState } from "react";
import { auth } from "../lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/library");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div style={{maxWidth:600}}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} style={{display:"grid", gap:8}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password" />
        <button type="submit">Login</button>
      </form>
      {err && <p style={{color:"red"}}>{err}</p>}
      <p>New? <Link href="/signup"><a>Sign up</a></Link></p>
    </div>
  );
}
