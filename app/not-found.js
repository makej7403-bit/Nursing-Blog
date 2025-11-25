// app/not-found.js
export default function NotFound() {
  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold">404 — Page not found</h1>
      <p className="mt-4">Sorry, we couldn't find that page. <a href="/" className="text-blue-600">Go home</a></p>
    </div>
  );
}
