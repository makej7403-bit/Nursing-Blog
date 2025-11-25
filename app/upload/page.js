"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import UploadForm from "@/components/UploadForm";

export default function UploadPage() {
  return (
    <div className="page-container">
      <h1>Upload File</h1>
      <UploadForm />
    </div>
  );
}
