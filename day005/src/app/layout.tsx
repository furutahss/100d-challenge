import type { Metadata } from "next";
import "./globals.scss";

const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "")
  .trim()
  .replace(/^\/+|\/+$/g, "");
const basePath = configuredBasePath ? `/${configuredBasePath}` : "";

export const metadata: Metadata = {
  title: "かずをかぞえよう",
  description: "画面のアイテムを数えて数字をえらぶゲームです。",
  icons: {
    icon: `${basePath}/favicon.svg`,
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
