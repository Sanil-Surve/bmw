import { Booking } from "@/types/booking";

// Initial seed bookings for immediate demo and testing in /admin
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: "BMW-2026-8492",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    fullName: "Vikramaditya Singhania",
    email: "vikram.singhania@apexcapital.in",
    phone: "+91 95947 81000",
    licenseNumber: "MH-01-2019-0048291",
    carId: "bmw-520d-luxury",
    carName: "BMW 520D Luxury Sedan",
    packageId: "full-day",
    packageName: "Full Day (8 HRS / 80 KM)",
    carDailyRate: 12000,
    pickupDate: "2026-10-27",
    pickupTime: "10:00",
    dropoffDate: "2026-10-27",
    dropoffTime: "18:00",
    pickupLocation: "Mumbai - Bandra Kurla Complex (BKC) / Bandra West",
    dropoffLocation: "Mumbai - Bandra Kurla Complex (BKC) / Bandra West",
    rentalType: "chauffeur",
    days: 1,
    totalPrice: 12000,
    status: "confirmed",
    notes: "Executive business schedule across BKC financial center. Uniformed chauffeur requested.",
    source: "local_store",
  },
  {
    id: "BMW-2026-7215",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    fullName: "Ananya Sharma",
    email: "ananya.sharma@horizonenterprises.in",
    phone: "+91 98112 37215",
    licenseNumber: "MH-02-2021-0082719",
    carId: "bmw-520d-airport",
    carName: "BMW 520D — Airport VIP Transfer",
    packageId: "airport-transfer",
    packageName: "T1 & T2 Airport Transfer",
    carDailyRate: 5000,
    pickupDate: "2026-10-27",
    pickupTime: "14:00",
    dropoffDate: "2026-10-27",
    dropoffTime: "17:00",
    pickupLocation: "Mumbai - CSMI Airport (T2 VIP Curbside Meet & Greet)",
    dropoffLocation: "Mumbai - South Mumbai (Marine Drive / Nariman Point / Colaba)",
    rentalType: "chauffeur",
    days: 1,
    totalPrice: 5000,
    status: "pending",
    notes: "Curbside T2 Terminal pickup for flight UK-955 from Delhi. Nameboard meet & greet.",
    source: "local_store",
  },
  {
    id: "BMW-2026-6104",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    fullName: "Rohan Malhotra",
    email: "rohan@malhotradesign.in",
    phone: "+91 97402 61040",
    licenseNumber: "MH-04-2020-0038102",
    carId: "bmw-520d-wedding",
    carName: "BMW 520D — Wedding & Groom Special",
    packageId: "extended-day",
    packageName: "Extended Day (12 HRS / 120 KM)",
    carDailyRate: 15500,
    pickupDate: "2026-10-25",
    pickupTime: "09:00",
    dropoffDate: "2026-10-25",
    dropoffTime: "21:00",
    pickupLocation: "Navi Mumbai - Vashi / Belapur / Kharghar / Panvel",
    dropoffLocation: "Mumbai - South Mumbai (Marine Drive / Nariman Point / Colaba)",
    rentalType: "chauffeur",
    days: 1,
    totalPrice: 15500,
    status: "completed",
    notes: "Wedding groom arrival at St. Regis Mumbai. White satin ribbons dressing applied.",
    source: "local_store",
  },
  {
    id: "BMW-2026-5831",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    fullName: "Dr. Kabir Oberoi",
    email: "dr.kabir@oberoi-med.in",
    phone: "+91 98920 15831",
    licenseNumber: "MH-01-2018-0051928",
    carId: "bmw-520d-luxury",
    carName: "BMW 520D Luxury Sedan",
    packageId: "half-day",
    packageName: "Half Day (4 HRS / 40 KM)",
    carDailyRate: 6500,
    pickupDate: "2026-10-28",
    pickupTime: "11:00",
    dropoffDate: "2026-10-28",
    dropoffTime: "15:00",
    pickupLocation: "Mumbai - Central Suburbs (Powai / Ghatkopar / Thane / Mulund)",
    dropoffLocation: "Mumbai - Western Suburbs (Andheri / Juhu / Goregaon / Borivali)",
    rentalType: "chauffeur",
    days: 1,
    totalPrice: 6500,
    status: "pending",
    notes: "Consulting visits to Lilavati Hospital. FASTag active for sea link.",
    source: "local_store",
  },
];

// In-memory store (persists across requests during the active Node process)
// In serverless, it also serves as immediate fallback cache.
let memoryBookings: Booking[] = [...INITIAL_DEMO_BOOKINGS];

export function getLocalBookings(): Booking[] {
  return [...memoryBookings];
}

export function addLocalBooking(booking: Booking): void {
  // Prepend new booking
  memoryBookings = [booking, ...memoryBookings];
}

export function updateLocalBookingStatus(id: string, status: Booking["status"]): boolean {
  const index = memoryBookings.findIndex((b) => b.id === id);
  if (index !== -1) {
    memoryBookings[index] = { ...memoryBookings[index], status };
    return true;
  }
  return false;
}

export function getGoogleScriptUrl(customUrl?: string | null): string | null {
  if (customUrl && customUrl.trim().startsWith("https://script.google.com/")) {
    return customUrl.trim();
  }
  return process.env.GOOGLE_APPS_SCRIPT_URL || process.env.NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL || null;
}
