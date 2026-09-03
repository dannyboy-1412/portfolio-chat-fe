import type { Metadata } from "next";
import { Geist, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Analytics } from '@vercel/analytics/next';
import { AppShell } from "./components/app-shell";
import { getSiteUrl } from "@/lib/siteUrl";
import { PROFILE } from "@/shared/profile";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Daniel Rodrigues | Software Engineer & AI Engineer",
  description:
    "Software engineer specialising in backend systems, AI applications and modern web development. Explore an interactive portfolio with a terminal assistant.",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: '/icon.svg', sizes: 'any' },
    ],
  },
  openGraph: {
    title: "Daniel Rodrigues | Software Engineer & AI Engineer",
    description:
      "Software engineer specialising in backend systems, AI applications and modern web development.",
    type: "website",
    locale: "en_AU",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Daniel Rodrigues | Software Engineer & AI Engineer",
    description:
      "Software engineer specialising in backend systems, AI applications and modern web development.",
  },
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: PROFILE.name,
  jobTitle: PROFILE.role,
  url: siteUrl,
  email: `mailto:${PROFILE.socials.email}`,
  sameAs: [PROFILE.socials.github, PROFILE.socials.linkedin],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body
        className={`${geistSans.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <AppShell>{children}</AppShell>
        <Analytics />
      </body>
    </html>
  );
}
