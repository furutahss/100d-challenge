import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "ダミー画像ジェネレーター",
  description: "サイズと色を指定して、モックアップ用のダミー画像を作成します。",
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
