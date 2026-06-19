import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRISHUL — Identity Trust Engine",
  description: "Continuous, risk-based identity trust for digital banking. Demo build.",
};

// Fonts are loaded via a standard stylesheet link (robust everywhere, no
// build-time fetch). Three faces, each with a role: Space Grotesk (display),
// Inter (body), JetBrains Mono (data readouts). Families are wired to CSS
// variables in globals.css.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;700&family=Space+Grotesk:wght@500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
