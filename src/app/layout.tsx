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
export const metadata: Metadata = {
  metadataBase: new URL("https://tabeen.dev"),
  title: {
    default: "Tabeen Raoof — ML Engineer & TPM",
    template: "%s · tabeen.dev",
  },
  description:
    "Engineer working at the intersection of machine learning and product. MS Computer Science at SFBU, building at FiPet.",
  authors: [{ name: "Tabeen Raoof" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tabeen.dev",
    siteName: "tabeen.dev",
  },
  twitter: {
    card: "summary_large_image",
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
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
