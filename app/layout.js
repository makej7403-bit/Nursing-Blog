// app/layout.js
export const metadata = {
  title: "Nursing Hub",
  description: "Nursing courses, notes, uploads & AI tools."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
