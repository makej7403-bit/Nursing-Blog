// components/FileList.js
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, query, where, orderBy, getDocs, limit } from "firebase/firestore";

export default function FileList({ courseId }) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let q;
        if (courseId) {
          q = query(collection(db, "files"), where("public","==",true), where("courseId","==",courseId), orderBy("createdAt","desc"), limit(100));
        } else {
          q = query(collection(db, "files"), where("public","==",true), orderBy("createdAt","desc"), limit(100));
        }
        const snap = await getDocs(q);
        setFiles(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [courseId]);

  if (loading) return <p>Loading files…</p>;
  if (!files.length) return <p>No files found.</p>;

  return (
    <ul>
      {files.map(f => (
        <li key={f.id} style={{marginBottom:8}}>
          <a href={f.url} target="_blank" rel="noopener noreferrer">{f.title || f.filename}</a>
          {" "}• {(f.size/1024).toFixed(0)} KB
          {f.courseId && <span> • Course: {f.courseId}</span>}
          <div style={{fontSize:12,color:"#666"}}>Uploaded by: {f.uploadedByEmail || f.uploadedBy}</div>
        </li>
      ))}
    </ul>
  );
}
