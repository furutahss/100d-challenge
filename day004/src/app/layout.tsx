import type { Metadata } from "next";
import "./globals.scss";

const configuredBasePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "")
  .trim()
  .replace(/^\/+|\/+$/g, "");
const basePath = configuredBasePath ? `/${configuredBasePath}` : "";

export const metadata: Metadata = {
  title: "画像サイズコンバータ",
  description: "ブラウザ内で画像のファイルサイズ・画像サイズを変換するツール",
  icons: { icon: `${basePath}/icon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
