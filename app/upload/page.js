"use client";
import { useState } from "react";
import { storage, db, auth } from "@/firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { addDoc, collection } from "firebase/firestore";

export default function UploadFile() {
  const [file, setFile] = useState(null);

  const upload = async () => {
    if (!file) return alert("Choose a file!");

    const path = `uploads/${auth.currentUser.uid}/${file.name}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "library"), {
      user: auth.currentUser.uid,
      name: file.name,
      url,
      createdAt: new Date(),
    });

    alert("Uploaded!");
  };

  return (
    <div className="p-6">
      <h2 className="font-bold text-xl">Upload Learning Materials</h2>

      <input
        className="mt-4"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <button
        onClick={upload}
        className="mt-4 bg-green-600 text-white p-2 rounded"
      >
        Upload
      </button>
    </div>
  );
}
