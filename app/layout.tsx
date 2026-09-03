import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLA Leadership Observatory",
  description:
    "A position-specific net assessment of PLA leadership succession, promotion pathways, institutional scenarios, and military-effectiveness implications.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  other: {
    "codex-preview": "development",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
