"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TariffSection } from "@/components/landing/tariff-section";
import { FleetShowcase } from "@/components/landing/fleet-showcase";
import { BookingForm } from "@/components/landing/booking-form";
import { FeaturesSection } from "@/components/landing/features-section";
import { FaqSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";
import { MobileActionBar } from "@/components/landing/mobile-action-bar";
import { FLEET_CARS } from "@/lib/fleet";

export default function Home() {
  const [selectedCarId, setSelectedCarId] = useState<string>(FLEET_CARS[0].id);
  const [selectedPackageId, setSelectedPackageId] = useState<string>("full-day");

  const scrollToBooking = () => {
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectCarAndScroll = (carId: string) => {
    setSelectedCarId(carId);
    if (carId === "bmw-520d-airport") {
      setSelectedPackageId("airport-transfer");
    } else if (carId === "bmw-520d-wedding") {
      setSelectedPackageId("extended-day");
    } else {
      setSelectedPackageId("full-day");
    }
    scrollToBooking();
  };

  const handleSelectPackageAndScroll = (packageId: string) => {
    setSelectedPackageId(packageId);
    if (packageId === "airport-transfer") {
      setSelectedCarId("bmw-520d-airport");
    } else if (packageId === "extended-day") {
      setSelectedCarId("bmw-520d-wedding");
    } else {
      setSelectedCarId("bmw-520d-luxury");
    }
    scrollToBooking();
  };

  return (
    <div className="min-h-screen bg-white text-[#090D15] flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1 pb-14 sm:pb-0">
        <Hero
          onSelectCarAndScroll={handleSelectCarAndScroll}
          onSelectPackageAndScroll={handleSelectPackageAndScroll}
        />
        <TariffSection onSelectPackage={handleSelectPackageAndScroll} />
        <FleetShowcase onSelectCar={handleSelectCarAndScroll} />
        <FeaturesSection />
        <BookingForm
          selectedCarId={selectedCarId}
          onCarChange={(id) => setSelectedCarId(id)}
          selectedPackageId={selectedPackageId}
          onPackageChange={(pkgId) => setSelectedPackageId(pkgId)}
        />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating 1-Tap Action Bar on Mobile */}
      <MobileActionBar />
    </div>
  );
}
