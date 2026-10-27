import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "BMW 520D Luxury Car On Rent | Mumbai & Navi Mumbai | Kalash BMW",
  description: "Rent BMW 520D Luxury Sedan in Mumbai & Navi Mumbai. Mini Duty (₹3,500), Short Duty (₹4,500), Half Day (₹6,500), Full Day (₹12,000), Extended Day (₹15,500), T1 & T2 Airport Transfers (₹5,000). Weddings, Corporate, VIP Travel. Call / WhatsApp: 9594781000.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", "font-sans")}
    >
      <body className="min-h-full flex flex-col overflow-x-hidden bg-white text-[#090D15] font-sans">{children}</body>
    </html>
  );
}
