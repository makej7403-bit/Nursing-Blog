// app/layout.js
import "./globals.css";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

export const metadata = {
  title: "Nursing Hub",
  description: "Nursing courses, notes, uploads & AI tools."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        <main className="max-w-4xl mx-auto">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
