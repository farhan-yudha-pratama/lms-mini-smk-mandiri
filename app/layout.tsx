import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "EduBrutal - Dashboard Belajar",
  description: "Database 101",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Anybody:wght@400;700;800;900&family=Hanken+Grotesk:wght@400;500;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F4F0EA] min-h-screen">
        {children}
      </body>
    </html>
  );
}
