// components/UploadForm.js
import { useState } from "react";
import { storage, db, auth } from "../lib/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function UploadForm({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [progress, setProgress] = useState(0);
  const [err, setErr] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setErr("");
    if (!file) return setErr("Please choose a file.");
    const user = auth.currentUser;
    if (!user) return setErr("You must be signed in.");

    try {
      const path = `uploads/${user.uid}/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      const task = uploadBytesResumable(storageRef, file);

      task.on("state_changed", snapshot => {
        const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setProgress(pct);
      }, error => setErr(error.message), async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        await addDoc(collection(db, "files"), {
          title: title || file.name,
          filename: file.name,
          url,
          courseId: course || null,
          size: file.size,
          contentType: file.type,
          createdAt: serverTimestamp(),
          uploadedBy: user.uid,
          uploadedByEmail: user.email,
          public: true,
          storagePath: path
        });
        setFile(null); setTitle(""); setCourse(""); setProgress(0);
        if (onUploaded) onUploaded();
      });
    } catch (e) {
      setErr(e.message);
    }
  };

  return (
    <form onSubmit={handleUpload} style={{display:"grid", gap:8}}>
      <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title (optional)" />
      <input value={course} onChange={e=>setCourse(e.target.value)} placeholder="Course ID (optional)" />
      <input type="file" onChange={e=>setFile(e.target.files[0])} />
      <div>
        <button type="submit">Upload</button>
        {progress > 0 && <span style={{marginLeft:12}}>Uploading {progress}%</span>}
      </div>
      {err && <div style={{color:"red"}}>{err}</div>}
    </form>
  );
}
