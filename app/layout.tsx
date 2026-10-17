
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GreenFarm — Թարմություն ամեն օր",
  description:
    "Թարմ մրգեր, բանջարեղեն, ընդեղեն և չրեր՝ GreenFarm-ից։",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="hy">
      <body>{children}</body>
    </html>
  );
}
