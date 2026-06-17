import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { HeaderGate } from "@/components/HeaderGate";
import { PwaInstallBanner } from "@/components/PwaInstallBanner";
import { ConditionalSiteFooter } from "@/components/ConditionalSiteFooter";
import { UtmCapture } from "@/components/UtmCapture";
import { YandexMetrika } from "@/components/YandexMetrika";
import { SITE_NAME, SITE_TAGLINE, siteUrl } from "@/lib/site";
import { Bitter, Libre_Baskerville, Oswald } from "next/font/google";
import { cn } from "@/lib/utils";

const bitter = Bitter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  weight: ["400", "500", "600"],
});

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  variable: "--font-h",
  weight: ["500", "600", "700"],
});

const libre = Libre_Baskerville({
  subsets: ["latin"],
  variable: "--font-sub",
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: `${SITE_NAME} — бесплатный тест`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_TAGLINE,
  applicationName: SITE_NAME,
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: siteUrl(),
    siteName: SITE_NAME,
    title: `${SITE_NAME} — бесплатный тест поведения`,
    description: SITE_TAGLINE,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — бесплатный тест`,
    description: SITE_TAGLINE,
    images: ["/og.png"],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE_NAME,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#818f6b",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={cn(bitter.variable, oswald.variable, libre.variable)}>
      <body className="min-h-screen bg-background font-body text-foreground antialiased">
        <UtmCapture />
        <YandexMetrika />
        <HeaderGate>
          <Header />
        </HeaderGate>
        {children}
        <ConditionalSiteFooter />
        <PwaInstallBanner />
      </body>
    </html>
  );
}
