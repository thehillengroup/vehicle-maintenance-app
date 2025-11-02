import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, Inter, JetBrains_Mono } from "next/font/google";

const headingFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});
const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | FleetCare",
    default: "FleetCare | Vehicle Maintenance Assistant",
  },
  description:
    "Track maintenance history, registration renewals, and emissions deadlines for every vehicle you manage.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-surface">
      <body
        className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable} min-h-full bg-surface text-ink antialiased font-body`}
      >
        <div className="flex min-h-screen flex-col">{children}</div>
      </body>
    </html>
  );
}
