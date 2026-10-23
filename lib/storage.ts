import { Booking } from "@/types/booking";

// Initial seed bookings for immediate demo and testing in /admin
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: "BMW-2026-8492",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    fullName: "Marcus Sterling",
    email: "marcus.sterling@example.com",
    phone: "+1 (555) 349-8201",
    licenseNumber: "DL-NY-9823481",
    carId: "bmw-m4-competition",
    carName: "BMW M4 Competition Coupé",
    carDailyRate: 390,
    pickupDate: "2026-10-25",
    pickupTime: "10:00",
    dropoffDate: "2026-10-28",
    dropoffTime: "18:00",
    pickupLocation: "International Airport (VIP Terminal Meet & Greet)",
    dropoffLocation: "International Airport (VIP Terminal Meet & Greet)",
    rentalType: "self-drive",
    days: 3,
    totalPrice: 1170,
    status: "confirmed",
    notes: "Prefers carbon bucket seat adjustment and full tank premium 98 fuel.",
    source: "local_store",
  },
  {
    id: "BMW-2026-7215",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    fullName: "Elena Rostova",
    email: "elena.rostova@prestigegroup.com",
    phone: "+1 (555) 891-2309",
    licenseNumber: "DL-CA-4428192",
    carId: "bmw-760i-executive",
    carName: "BMW 760i xDrive Executive",
    carDailyRate: 410,
    pickupDate: "2026-10-27",
    pickupTime: "14:00",
    dropoffDate: "2026-10-30",
    dropoffTime: "12:00",
    pickupLocation: "Downtown Luxury Hotel Delivery",
    dropoffLocation: "Downtown Luxury Hotel Delivery",
    rentalType: "chauffeur",
    days: 3,
    totalPrice: 1230,
    status: "pending",
    notes: "VIP Client attending International Tech Summit. English & German speaking chauffeur preferred.",
    source: "local_store",
  },
  {
    id: "BMW-2026-6104",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    fullName: "Julian Vance",
    email: "jvance@aerocore.io",
    phone: "+1 (555) 431-7720",
    licenseNumber: "DL-TX-1092837",
    carId: "bmw-i8-roadster",
    carName: "BMW i8 Roadster",
    carDailyRate: 440,
    pickupDate: "2026-10-24",
    pickupTime: "09:00",
    dropoffDate: "2026-10-26",
    dropoffTime: "20:00",
    pickupLocation: "Central Business District Hub",
    dropoffLocation: "International Airport (VIP Terminal Meet & Greet)",
    rentalType: "self-drive",
    days: 2,
    totalPrice: 880,
    status: "completed",
    notes: "Weekend coastal anniversary getaway.",
    source: "local_store",
  },
  {
    id: "BMW-2026-5831",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    fullName: "Dr. Alistair Chen",
    email: "alistair.chen@medcenter.org",
    phone: "+1 (555) 672-9914",
    licenseNumber: "DL-MA-5519280",
    carId: "bmw-x5-m",
    carName: "BMW X5 M Competition",
    carDailyRate: 360,
    pickupDate: "2026-10-29",
    pickupTime: "11:00",
    dropoffDate: "2026-11-03",
    dropoffTime: "16:00",
    pickupLocation: "Private Residence / Doorstep Delivery",
    dropoffLocation: "Private Residence / Doorstep Delivery",
    rentalType: "self-drive",
    days: 5,
    totalPrice: 1800,
    status: "pending",
    notes: "Family alpine road trip. Child seats requested for rear row.",
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
