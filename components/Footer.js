// components/Footer.js
export default function Footer() {
  return (
    <footer className="border-t p-4 mt-8">
      <div className="max-w-4xl mx-auto text-center text-sm">
        © {new Date().getFullYear()} NursingHub — Learn & share nursing knowledge.
      </div>
    </footer>
  );
}
