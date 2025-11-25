// pages/signup.js
import { useState } from "react";
import { auth, db } from "../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Signup() {
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [err,setErr]=useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCred.user.uid), {
        email: email,
        joined: new Date()
      });
      router.push("/upload");
    } catch (error) {
      setErr(error.message);
    }
  };

  return (
    <div style={{maxWidth:600}}>
      <h1>Sign up</h1>
      <form onSubmit={handleSignup} style={{display:"grid", gap:8}}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" type="email"/>
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Password" type="password"/>
        <button type="submit">Create account</button>
      </form>
      {err && <p style={{color:"red"}}>{err}</p>}
      <p>Already a member? <Link href="/login"><a>Login</a></Link></p>
    </div>
  );
}
