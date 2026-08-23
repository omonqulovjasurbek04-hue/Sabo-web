import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { ThemeInit } from "@/components/layout/theme-init";
import { getSiteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "SABO — Sut mahsulotlari",
    template: "%s | SABO",
  },
  description: "SABO — sifatli sut mahsulotlari.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="uz"
      suppressHydrationWarning
      className={cn(playfair.variable, inter.variable, "font-sans")}
    >
      <head>
        <ThemeInit />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-background text-foreground antialiased selection:bg-primary selection:text-white"
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}