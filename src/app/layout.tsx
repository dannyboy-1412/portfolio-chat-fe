import type { Metadata } from "next";
import Script from "next/script";
import { Fredoka, Geist, Geist_Mono, Space_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { DEFAULT_THEME_ID, THEME_STORAGE_KEY } from "@/shared/themes";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
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

const themeBootScript = `
(function(){
  try {
    var key = ${JSON.stringify(THEME_STORAGE_KEY)};
    var fallback = ${JSON.stringify(DEFAULT_THEME_ID)};
    var stored = localStorage.getItem(key);
    var allowed = ['default','blurryface','ok-computer','blue-album'];
    var theme = allowed.indexOf(stored) !== -1 ? stored : fallback;
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.add('dark');
  } catch (e) {
    document.documentElement.dataset.theme = ${JSON.stringify(DEFAULT_THEME_ID)};
    document.documentElement.classList.add('dark');
  }
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-theme={DEFAULT_THEME_ID} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${spaceMono.variable} ${fredoka.variable} antialiased`}
      >
        <Script id="theme-boot" strategy="beforeInteractive">
          {themeBootScript}
        </Script>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
