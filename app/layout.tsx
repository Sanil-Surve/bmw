import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#061110",
};

export const metadata: Metadata = {
  title: "Kalash BMW Cars | Premium Luxury Car Rentals",
  description: "Experience The Ultimate Driving Machine with Kalash BMW Cars. Rent BMW M4, M5 CS, i8 Roadster, X5 M, and 7-Series with white-glove delivery, zero hidden fees, and full insurance included.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-[#061110] text-[#FAF7F0]">{children}</body>
    </html>
  );
}
