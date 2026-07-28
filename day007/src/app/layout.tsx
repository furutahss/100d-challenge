import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = { title: "シルエット クイズ", description: "真っ黒なシルエットから動物や乗り物を当てる幼児向けゲーム", icons: { icon: "./favicon.svg" } };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="ja"><body>{children}</body></html>; }
