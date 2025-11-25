// app/page.js
export default function Home() {
  return (
    <main className="p-6">
      <h1 className="text-3xl font-bold">Nursing Hub</h1>
      <p>Your home for nursing courses, notes, and shared materials.</p>

      <div className="mt-6 grid gap-4">
        <a href="/courses" className="p-4 border rounded">Browse Courses</a>
        <a href="/notes" className="p-4 border rounded">Nursing Notes</a>
        <a href="/library" className="p-4 border rounded">Public Library</a>
        <a href="/upload" className="p-4 border rounded">Upload Files</a>
        <a href="/ai/chat" className="p-4 border rounded">AI Nurse Tutor</a>
      </div>
    </main>
  );
}
