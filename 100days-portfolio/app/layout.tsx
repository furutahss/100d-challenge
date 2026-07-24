import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  metadataBase: new URL("https://100d.furutahss.com"),
  title: "100 DAYS / VIBE CODING",
  description:
    "AIと一緒に、100日間、毎日ひとつのプロジェクトをつくるチャレンジの記録。",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "100 DAYS / VIBE CODING",
    description:
      "AIと一緒に、100日間、毎日ひとつのプロジェクトをつくるチャレンジの記録。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "100 DAYS / VIBE CODING",
    description:
      "AIと一緒に、100日間、毎日ひとつのプロジェクトをつくるチャレンジの記録。",
  },
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
