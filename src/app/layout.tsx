import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";

import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin", "latin-ext"],
  weight: "400",
  style: ["normal", "italic"],
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
    "AI mokymai lietuviams. Greitas video kursas, savaitiniai webinarai, mokymai komandai. Sutaupyk valandas kasdien su praktiniais AI įrankiais.",
  openGraph: {
    type: "website",
    locale: "lt_LT",
    siteName: "AI Studijos",
    title: "AI Studijos — Mokykis dirbtinio intelekto Lietuvoje",
    description:
      "Greitas video kursas, savaitiniai webinarai, mokymai komandai.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="lt"
      className={`${inter.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground flex flex-col">
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
