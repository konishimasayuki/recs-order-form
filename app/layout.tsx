import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const notoSansJP = localFont({
  src: [
    { path: "../public/fonts/NotoSansJP-Regular.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/NotoSansJP-Bold.ttf", weight: "700", style: "normal" }
  ],
  variable: "--font-noto-sans-jp",
  display: "swap"
});

export const metadata: Metadata = {
  title: "RECS ご注文フォーム | 株式会社エイチビーソフトスタジオ",
  description: "RECS（リモート始動阻止装置）GPS装置のご注文フォームです。"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className={notoSansJP.variable}>{children}</body>
    </html>
  );
}
