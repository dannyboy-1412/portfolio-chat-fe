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

export const metadata: Metadata = {
  title: "Daniel A Rodrigues - Software Engineer",
  description:
    "Interactive portfolio of Daniel A Rodrigues. Full-stack developer with a backend focus - chat about the apps and systems I've built.",
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any' },
    ],
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
