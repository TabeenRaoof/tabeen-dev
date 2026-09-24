import type { Metadata } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import "./globals.css";

// Font loading — Next.js handles subsetting and self-hosting automatically,
// so no external font requests at runtime (better privacy, faster first paint)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

// Site-wide metadata. Per-page pages can override individual fields.
// metadataBase is what Next uses to resolve relative OG image URLs.
const SITE_DESCRIPTION =
  "Applied AI/ML engineer in the Bay Area. Computer-vision research, backend services, and enterprise delivery experience.";

export const metadata: Metadata = {
  metadataBase: new URL("https://tabeen.dev"),
  title: {
    default: "Tabeen Raoof — Applied AI/ML Engineer",
    template: "%s · tabeen.dev",
  },
  description: SITE_DESCRIPTION,
  authors: [{ name: "Tabeen Raoof" }],
  alternates: {
    canonical: "https://tabeen.dev",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tabeen.dev",
    siteName: "tabeen.dev",
    title: "Tabeen Raoof — Applied AI/ML Engineer",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Tabeen Raoof — Applied AI/ML Engineer",
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${instrumentSerif.variable} ${jetbrainsMono.variable}`}
      >
        <div className="min-h-screen flex flex-col">
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
