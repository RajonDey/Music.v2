import { Fraunces, Source_Sans_3 } from "next/font/google";
import type { Metadata } from "next";
import { PublicSiteJsonLd } from "@/components/public/PublicSiteJsonLd";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { ThemeScript } from "@/components/theme/ThemeScript";
import {
  GoogleTagManagerHead,
  GoogleTagManagerNoscript,
} from "@/components/analytics/GoogleTagManager";
import { PUBLIC_SITE } from "@/lib/public-site-legacy";
import "@music/tokens/globals.css";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(PUBLIC_SITE.url),
  title: {
    default: PUBLIC_SITE.title,
    template: `%s | ${PUBLIC_SITE.siteName}`,
  },
  description: PUBLIC_SITE.description,
  keywords: [...PUBLIC_SITE.keywords],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: PUBLIC_SITE.url,
    siteName: PUBLIC_SITE.siteName,
    title: PUBLIC_SITE.title,
    description: PUBLIC_SITE.ogDescription,
    images: [
      {
        url: PUBLIC_SITE.assets.ogCover,
        width: 1200,
        height: 630,
        alt: "Feel the Sound — Rajon Dey Music",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: PUBLIC_SITE.title,
    description: PUBLIC_SITE.ogDescription,
    images: [PUBLIC_SITE.assets.ogCover],
  },
  icons: {
    icon: [
      { url: PUBLIC_SITE.assets.favicon32, sizes: "32x32", type: "image/png" },
      { url: PUBLIC_SITE.assets.icon192, sizes: "192x192", type: "image/png" },
    ],
    apple: PUBLIC_SITE.assets.appleTouchIcon,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable}`}
      data-theme="light"
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
        <GoogleTagManagerHead />
      </head>
      <body className="font-body antialiased">
        <GoogleTagManagerNoscript />
        <ThemeProvider>
          <PublicSiteJsonLd />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
