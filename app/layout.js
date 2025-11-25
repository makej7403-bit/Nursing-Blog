// app/layout.js
import "./globals.css";

export const metadata = {
  title: "Nursing Hub",
  description: "A simple nursing resources app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        {/* TEMP ERROR DEBUGGER – WILL SHOW ANY FRONTEND ERROR */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onerror = function(message, source, line, column, error) {
                document.body.innerHTML =
                  "<div style='padding:20px;font-family:Arial;color:red;'>" +
                  "<h2>⚠ JavaScript Error Detected</h2>" +
                  "<p><strong>Message:</strong> " + message + "</p>" +
                  "<p><strong>Source:</strong> " + source + "</p>" +
                  "<p><strong>Line:</strong> " + line + ":" + column + "</p>" +
                  "</div>";
              };
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}
