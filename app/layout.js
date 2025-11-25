// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Nursing Blog",
  description: "A simple nursing library blog",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head />
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
