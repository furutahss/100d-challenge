import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "タッチ・ザ・カラー",
  description: "動くカラーボールからお題の色を素早くタップするゲームです。",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.png` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
