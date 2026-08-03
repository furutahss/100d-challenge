import type { Metadata } from "next";
import "./globals.scss";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
export const metadata: Metadata = {
  title: "どうぶつに ごはんをあげよう | Animal Café",
  description: "どうぶつたちに、すきなごはんを届ける5問ゲーム。",
  icons: { icon: `${basePath}/favicon.svg` },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ja"><body>{children}</body></html>;
}
