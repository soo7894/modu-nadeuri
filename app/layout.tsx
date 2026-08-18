import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "모두나들이 | 모두에게 맞는 문화활동 찾기",
  description:
    "지역과 시간, 장애인 편의와 할인 조건에 맞는 문화활동을 한눈에 찾아보세요.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
