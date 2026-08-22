import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Daniel A Rodrigues - Software Engineer",
  description:
    "Interactive portfolio of Daniel A Rodrigues. Backend-focused engineer — document AI, accounting agents, and on-chain data. Chat about the systems I've built.",
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any' },
    ],
  },
  openGraph: {
    title: "Daniel A Rodrigues - Software Engineer",
    description:
      "Backend-focused engineer — document AI, accounting agents, and on-chain data.",
    type: "website",
    locale: "en_AU",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel A Rodrigues - Software Engineer",
    description:
      "Backend-focused engineer — document AI, accounting agents, and on-chain data.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
