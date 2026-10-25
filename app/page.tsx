"use client";

import { useState } from "react";
import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { FleetShowcase } from "@/components/landing/fleet-showcase";
import { BookingForm } from "@/components/landing/booking-form";
import { FeaturesSection } from "@/components/landing/features-section";
import { FaqSection } from "@/components/landing/faq-section";
import { Footer } from "@/components/landing/footer";
import { FLEET_CARS } from "@/lib/fleet";

export default function Home() {
  const [selectedCarId, setSelectedCarId] = useState<string>(FLEET_CARS[0].id);

  const handleSelectCarAndScroll = (carId: string) => {
    setSelectedCarId(carId);
    const bookingSection = document.getElementById("booking");
    if (bookingSection) {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#090D15] flex flex-col font-sans selection:bg-teal-600 selection:text-white">
      {/* Sticky Header */}
      <Navbar />

      {/* Main Sections */}
      <main className="flex-1">
        <Hero onSelectCarAndScroll={handleSelectCarAndScroll} />
        <FleetShowcase onSelectCar={handleSelectCarAndScroll} />
        <BookingForm
          selectedCarId={selectedCarId}
          onCarChange={(id) => setSelectedCarId(id)}
        />
        <FeaturesSection />
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
