import { Booking } from "@/types/booking";

// Initial seed bookings for immediate demo and testing in /admin
const INITIAL_DEMO_BOOKINGS: Booking[] = [
  {
    id: "BMW-2026-8492",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    fullName: "Vikramaditya Singhania",
    email: "vikram.singhania@apexcapital.in",
    phone: "+91 98201 54920",
    licenseNumber: "MH-01-2019-0048291",
    carId: "bmw-m4-competition",
    carName: "BMW M4 Competition Coupé",
    carDailyRate: 35000,
    pickupDate: "2026-10-25",
    pickupTime: "10:00",
    dropoffDate: "2026-10-28",
    dropoffTime: "18:00",
    pickupLocation: "Mumbai - CSMI Airport (T2 VIP Meet & Greet)",
    dropoffLocation: "Mumbai - CSMI Airport (T2 VIP Meet & Greet)",
    rentalType: "self-drive",
    days: 3,
    totalPrice: 105000,
    status: "confirmed",
    notes: "Prefers carbon bucket seat adjustment and full tank XP95 fuel. FASTag active.",
    source: "local_store",
  },
  {
    id: "BMW-2026-7215",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(), // 18 hours ago
    fullName: "Ananya Sharma",
    email: "ananya.sharma@horizonenterprises.in",
    phone: "+91 98112 37215",
    licenseNumber: "DL-03-2021-0082719",
    carId: "bmw-760i-executive",
    carName: "BMW 760i xDrive Executive",
    carDailyRate: 38000,
    pickupDate: "2026-10-27",
    pickupTime: "14:00",
    dropoffDate: "2026-10-30",
    dropoffTime: "12:00",
    pickupLocation: "Delhi NCR - Aerocity / CyberCity / Diplomatic Enclave",
    dropoffLocation: "Delhi NCR - Aerocity / CyberCity / Diplomatic Enclave",
    rentalType: "chauffeur",
    days: 3,
    totalPrice: 121500, // 3 * 38000 + 3 * 2500
    status: "pending",
    notes: "VIP Delegation attending India Tech Summit at Bharat Mandapam. GST invoice requested for corporate filing.",
    source: "local_store",
  },
  {
    id: "BMW-2026-6104",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
    fullName: "Rohan Malhotra",
    email: "rohan@malhotradesign.in",
    phone: "+91 97402 61040",
    licenseNumber: "KA-04-2020-0038102",
    carId: "bmw-i8-roadster",
    carName: "BMW i8 Roadster",
    carDailyRate: 42000,
    pickupDate: "2026-10-24",
    pickupTime: "09:00",
    dropoffDate: "2026-10-26",
    dropoffTime: "20:00",
    pickupLocation: "Bengaluru - UB City / Indiranagar / Whitefield Delivery",
    dropoffLocation: "Bengaluru - Kempegowda Intl Airport (VIP Terminal)",
    rentalType: "self-drive",
    days: 2,
    totalPrice: 84000,
    status: "completed",
    notes: "Weekend drive to Coorg resorts. Portable Type-2 charger requested.",
    source: "local_store",
  },
  {
    id: "BMW-2026-5831",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
    fullName: "Dr. Kabir Oberoi",
    email: "dr.kabir@oberoi-med.in",
    phone: "+91 98920 15831",
    licenseNumber: "GA-02-2018-0051928",
    carId: "bmw-x5-m",
    carName: "BMW X5 M Competition",
    carDailyRate: 32000,
    pickupDate: "2026-10-29",
    pickupTime: "11:00",
    dropoffDate: "2026-11-03",
    dropoffTime: "16:00",
    pickupLocation: "Goa - Manohar Intl (Mopa) / Dabolim Airport & Resort Delivery",
    dropoffLocation: "Goa - Manohar Intl (Mopa) / Dabolim Airport & Resort Delivery",
    rentalType: "self-drive",
    days: 5,
    totalPrice: 160000,
    status: "pending",
    notes: "Family holiday in North Goa private villa. Child seat requested.",
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
