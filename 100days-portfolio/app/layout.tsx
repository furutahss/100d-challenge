import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "100 DAYS / VIBE CODING",
  description:
    "AIと一緒に、100日間、毎日ひとつのプロジェクトをつくるチャレンジの記録。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
