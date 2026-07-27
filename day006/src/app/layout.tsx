import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "Markdown テーブルジェネレーター",
  description: "スプレッドシートから貼り付けてMarkdown表を生成するツール",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
