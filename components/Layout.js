// components/Layout.js
import Link from "next/link";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";

export default function Layout({ children, user }) {
  return (
    <>
      <header style={{padding:12, borderBottom:"1px solid #eee"}}>
        <div style={{maxWidth:900, margin:"0 auto", display:"flex", justifyContent:"space-between"}}>
          <div><Link href="/"><a style={{fontWeight:700}}>NursingHub</a></Link></div>
          <nav>
            <Link href="/"><a style={{marginRight:12}}>Home</a></Link>
            <Link href="/library"><a style={{marginRight:12}}>Library</a></Link>
            <Link href="/upload"><a style={{marginRight:12}}>Upload</a></Link>
            <Link href="/ai"><a style={{marginRight:12}}>AI</a></Link>
            {user ? (
              <>
                <span style={{marginRight:12}}>{user.email}</span>
                <button onClick={() => signOut(auth)}>Sign out</button>
              </>
            ) : (
              <>
                <Link href="/login"><a style={{marginRight:12}}>Login</a></Link>
                <Link href="/signup"><a>Sign up</a></Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main style={{maxWidth:900, margin:"2rem auto"}}>{children}</main>

      <footer style={{textAlign:"center", padding:20, borderTop:"1px solid #eee"}}>
        <small>© {new Date().getFullYear()} NursingHub</small>
      </footer>
    </>
  );
}
