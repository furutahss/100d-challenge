import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: "どっちがはやい？ | Speed Quiz",
  description: "乗り物の速さをくらべる5問クイズ",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
