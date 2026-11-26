import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AutoRecruit AI — Hire with confidence",
  description: "AI-powered recruitment for companies, HR teams, and job seekers.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased min-h-screen">{children}</body>
    </html>
  );
}
