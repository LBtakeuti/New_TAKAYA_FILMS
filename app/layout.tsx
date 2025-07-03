import type { Metadata } from "next";
import "./globals.css";
import "./index.css";

export const metadata: Metadata = {
  title: "TAKAYA FILMS",
  description: "Videographer / Video Director - Takaya Toriyabe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="font-sans">{children}</body>
    </html>
  );
}
