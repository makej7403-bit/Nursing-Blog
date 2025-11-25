"use client";

export const dynamic = "force-dynamic";
export const runtime = "edge";

import FileList from "@/components/FileList";

export default function LibraryPage() {
  return (
    <div className="page-container">
      <h1>Your Library</h1>
      <FileList />
    </div>
  );
}
