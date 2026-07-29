import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "OGP-Previewer",
  description: "SNSシェア用のOGPメタタグを生成し、カード表示をプレビューするツール",
  icons: { icon: "./favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
