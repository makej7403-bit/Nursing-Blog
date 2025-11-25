"use client";
import { useState } from "react";
import { auth } from '@/firebase/config';
import { signInWithEmailAndPassword } from "firebase/auth";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Logged in!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Login</h2>

      <input className="border p-2 mt-3 w-full"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <input className="border p-2 mt-3 w-full"
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={login}
        className="mt-4 p-2 bg-blue-600 text-white rounded"
      >
        Login
      </button>
    </div>
  );
}
