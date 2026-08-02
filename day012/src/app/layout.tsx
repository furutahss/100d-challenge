import type { Metadata } from "next";
import "./globals.scss";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const metadata: Metadata = {
  title: "画像 → カラーパレット抽出ツール",
  description: "画像から主要な5色を抽出し、Hexコードをコピーできる無料ツールです。",
  icons: { icon: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
