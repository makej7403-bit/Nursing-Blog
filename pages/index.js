// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>NursingHub — Courses & Notes</h1>
      <p>Share nursing notes, PDFs, audio and learn together.</p>

      <div style={{marginTop:20}}>
        <Link href="/library"><a>Browse Library</a></Link> • <Link href="/upload"><a style={{marginLeft:10}}>Upload</a></Link> • <Link href="/ai"><a style={{marginLeft:10}}>Ask AI</a></Link>
      </div>
    </div>
  );
}
