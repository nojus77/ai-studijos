import type { Metadata, Viewport } from "next";
import {
  IBM_Plex_Sans,
  Playfair_Display,
  Plus_Jakarta_Sans,
} from "next/font/google";

import { MetaPixel } from "@/components/meta-pixel";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const ibm = IBM_Plex_Sans({
  variable: "--font-ibm",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://aistudijos.lt",
  ),
  title: {
    default: "AI Studijos — Mokykis dirbtinio intelekto Lietuvoje",
    template: "%s · AI Studijos",
  },
  description:
    "AI mokymai lietuviams. Greitas video kursas, mėnesinis bootcamp, mokymai komandai. Sutaupyk valandas kasdien su praktiniais AI įrankiais.",
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: "AI Studijos",
    title: "AI Studijos — Mokykis dirbtinio intelekto Lietuvoje",
    description: "Greitas video kursas, mėnesinis bootcamp, mokymai komandai.",
    images: [
      {
        url: "/product.png",
        width: 1536,
        height: 1024,
        alt: "AI Asistento gidas — 39 €",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Studijos — Mokykis dirbtinio intelekto Lietuvoje",
    description: "Greitas video kursas, mėnesinis bootcamp, mokymai komandai.",
    images: ["/product.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#fcfaf4",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="lt"
      className={`${ibm.variable} ${jakarta.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col">
        <MetaPixel />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
