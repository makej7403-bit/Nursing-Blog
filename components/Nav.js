// components/Nav.js
"use client";
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useEffect, useState } from "react";

export default function Nav() {
  const [user, setUser] = useState(null);
  useEffect(()=> {
    const unsub = auth.onAuthStateChanged(u => setUser(u));
    return () => unsub();
  }, []);
  return (
    <header className="border-b p-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="font-bold text-lg"><Link href="/">NursingHub</Link></div>
        <nav className="space-x-4">
          <Link href="/library">Library</Link>
          <Link href="/upload">Upload</Link>
          <Link href="/ai/chat">AI</Link>
          {user ? (
            <>
              <span>{user.email}</span>
              <button onClick={()=>signOut(auth)} className="ml-2">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
