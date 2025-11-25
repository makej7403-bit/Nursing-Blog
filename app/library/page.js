"use client";
import { useEffect, useState } from "react";
import { db } from "@/firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export default function Library() {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "library"), (snap) => {
      setFiles(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Public Library</h2>

      <div className="mt-4 space-y-3">
        {files.map((f) => (
          <a
            key={f.id}
            href={f.url}
            target="_blank"
            className="block p-3 border rounded"
          >
            {f.name}
          </a>
        ))}
      </div>
    </div>
  );
}
