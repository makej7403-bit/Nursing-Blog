"use client";
import { useState } from "react";
import { auth } from "@/firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Account created!");
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Create an Account</h2>

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
        onClick={signup}
        className="mt-4 p-2 bg-blue-600 text-white rounded"
      >
        Sign Up
      </button>
    </div>
  );
}
