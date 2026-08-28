import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://raasta.online"),
  title: {
    default: "Raasta — One Clear Next Step Through Government Services",
    template: "%s | Raasta",
  },
  description:
    "A citizen recovery layer for public services. PM-KISAN, DBT, and welfare entitlement tracking that turns complex government process states into one clear next step.",
  applicationName: "Raasta",
  keywords: [
    "Raasta",
    "PM-KISAN",
    "DBT",
    "Government Services",
    "Citizen Recovery Layer",
    "e-KYC",
    "Farmer Scheme",
    "Welfare Entitlements",
  ],
  authors: [{ name: "Raasta Team", url: "https://raasta.online" }],
  creator: "Raasta",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://raasta.online",
    siteName: "Raasta",
    title: "Raasta — One Clear Next Step Through Government Services",
    description:
      "A citizen case system that turns complex government process states into one clear next step — or tells the citizen when no action is required.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Raasta — One Clear Next Step Through Government Services",
    description:
      "A citizen case system that turns complex government process states into one clear next step.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
