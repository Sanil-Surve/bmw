import { CarModel, RentalPackage } from "@/types/booking";

export const CHAUFFEUR_DAILY_RATE = 2000; // ₹2,000/day professional chauffeur service

export const CONTACT_INFO = {
  phone: "9594781000",
  formattedPhone: "+91 95947 81000",
  phoneTel: "tel:+919594781000",
  whatsappUrl: "https://wa.me/919594781000?text=Hello%20Kalash%20BMW%2C%20I%20would%20like%20to%20inquire%20about%20booking%20the%20BMW%20520d.",
  tagline: "BMW DRIVING IS A PASSION.",
};

export const EXTRA_CHARGES = {
  extraKmRate: 140, // ₹140/Km
  extraHourRate: 1500, // ₹1,500/hour
  nightAllowance: 2000, // ₹2,000 (10 PM - 6 AM)
  tollParking: "Actual", // Toll & Parking at actuals
};

export const RENTAL_PACKAGES: RentalPackage[] = [
  {
    id: "mini-duty",
    name: "Mini Duty",
    durationText: "2 HRS / 20 KM",
    hours: 2,
    distanceKm: 20,
    price: 3500,
    description: "Quick city transit, executive meetings & short business runs.",
    category: "duty",
  },
  {
    id: "short-duty",
    name: "Short Duty",
    durationText: "3 HRS / 30 KM",
    hours: 3,
    distanceKm: 30,
    price: 4500,
    description: "Executive travel, client visits & luxury dinner transfers.",
    category: "duty",
  },
  {
    id: "half-day",
    name: "Half Day",
    durationText: "4 HRS / 40 KM",
    hours: 4,
    distanceKm: 40,
    price: 6500,
    badge: "Popular",
    popular: true,
    description: "Half-day corporate schedule, photoshoots & high-profile transit.",
    category: "duty",
  },
  {
    id: "full-day",
    name: "Full Day",
    durationText: "8 HRS / 80 KM",
    hours: 8,
    distanceKm: 80,
    price: 12000,
    badge: "Most Popular",
    popular: true,
    description: "Full day luxury schedule, weddings, corporate delegates & VIP touring.",
    category: "duty",
  },
  {
    id: "extended-day",
    name: "Extended Day",
    durationText: "12 HRS / 120 KM",
    hours: 12,
    distanceKm: 120,
    price: 15500,
    badge: "Maximum Value",
    description: "Multi-venue wedding celebrations, full-day filming & extended events.",
    category: "duty",
  },
  {
    id: "airport-transfer",
    name: "T1 & T2 Airport Transfer",
    durationText: "One Way Curbside",
    hours: 3,
    distanceKm: 45,
    price: 5000,
    badge: "Airport Special",
    popular: true,
    description: "Dedicated curbside pickup or drop at Mumbai Airport T1 & T2 terminals.",
    category: "transfer",
  },
  {
    id: "navi-mumbai-transfer",
    name: "Navi Mumbai Pickup / Drop",
    durationText: "One Way Transit",
    hours: 2,
    distanceKm: 35,
    price: 3500,
    badge: "Fast Transit",
    description: "Smooth direct transfer between Mumbai and Navi Mumbai locations.",
    category: "transfer",
  },
];

export const FLEET_CARS: CarModel[] = [
  {
    id: "bmw-520d-luxury",
    name: "BMW 520D Luxury Sedan",
    modelCode: "G30 LCI",
    category: "Luxury Sedan",
    pricePerDay: 12000, // ₹12,000/day (8 HRS / 80 KM Full Day base rate)
    image: "/bmw.webp",
    tagline: "BMW DRIVING IS A PASSION. White-glove luxury chauffeur service across Mumbai & MMR.",
    badge: "Flagship Luxury",
    specs: {
      power: "190 HP / 400 Nm",
      acceleration: "7.2s (0-100 km/h)",
      transmission: "8-Speed Steptronic Automatic",
      topSpeed: "235 km/h",
      seats: 5,
      fuelType: "TwinPower Turbo Diesel",
    },
    features: [
      "Plush Dakota Leather & Executive Rear Armrest",
      "Electric Sunroof & Ambient Cabin Illumination",
      "Harman Kardon Surround Sound System",
      "Active Expressway FASTag Included",
      "Multi-Zone Rear Climate Control & Sunblinds",
      "Uniformed Executive Chauffeur Included",
    ],
  },
  {
    id: "bmw-520d-wedding",
    name: "BMW 520D — Wedding & Groom Special",
    modelCode: "G30 Luxury",
    category: "Weddings & VIP",
    pricePerDay: 15500, // ₹15,500 (Extended Day 12h/120km)
    image: "/bmw.webp",
    tagline: "Grand bridal and groom arrival with immaculate white sedan styling and ribbon dressing.",
    badge: "Weddings",
    specs: {
      power: "190 HP / 400 Nm",
      acceleration: "7.2s (0-100 km/h)",
      transmission: "8-Speed Steptronic",
      topSpeed: "235 km/h",
      seats: 5,
      fuelType: "TwinPower Turbo Diesel",
    },
    features: [
      "Spotless Alpine White Exterior Finish",
      "Wedding Ribbon & Decorative Dressing Ready",
      "Courteous Chauffeur in Formal Attire",
      "Red-Carpet Grade Arrival & Punctuality",
      "Spacious Rear Cabin for Bridal Attire",
      "Expressway FASTag Equipped",
    ],
  },
  {
    id: "bmw-520d-airport",
    name: "BMW 520D — Airport VIP Transfer",
    modelCode: "G30 Curbside",
    category: "Airport Transfer",
    pricePerDay: 5000, // ₹5,000 T1 & T2 Airport One Way
    image: "/bmw.webp",
    tagline: "Prompt, comfortable curbside handover at Mumbai Airport T1 & T2 terminals.",
    badge: "T1 & T2 Airport",
    specs: {
      power: "190 HP / 400 Nm",
      acceleration: "7.2s (0-100 km/h)",
      transmission: "8-Speed Steptronic",
      topSpeed: "235 km/h",
      seats: 5,
      fuelType: "TwinPower Turbo Diesel",
    },
    features: [
      "Real-Time Flight Tracking & Zero Delay Buffer",
      "Curbside Nameboard Meet & Greet Service",
      "Generous Luggage Capacity (3-4 Large Bags)",
      "Complimentary Mineral Water & Device Chargers",
      "Seamless Toll Tag Highway Crossing",
      "Safe, Sanitized & Punctual Handover",
    ],
  },
  {
    id: "bmw-520d-corporate",
    name: "BMW 520D — Corporate & VIP Delegation",
    modelCode: "G30 Executive",
    category: "Corporate Travel",
    pricePerDay: 12000, // ₹12,000 Full Day 8h/80km
    image: "/bmw.webp",
    tagline: "Executive presence for BKC board meetings, corporate conferences, and VIP clients.",
    badge: "Corporate",
    specs: {
      power: "190 HP / 400 Nm",
      acceleration: "7.2s (0-100 km/h)",
      transmission: "8-Speed Steptronic",
      topSpeed: "235 km/h",
      seats: 5,
      fuelType: "TwinPower Turbo Diesel",
    },
    features: [
      "Official Corporate 18% GST Invoice Included",
      "Discreet, English-Speaking Professional Chauffeur",
      "In-Cabin 12V / USB-C Laptop & Phone Charging",
      "Smooth Whisper-Quiet Expressway Ride",
      "Flexible Itinerary Across Mumbai Metropolitan",
      "Priority Customer Support Hotline",
    ],
  },
];

export const POPULAR_LOCATIONS = [
  "Mumbai - CSMI Airport (T2 VIP Curbside Meet & Greet)",
  "Mumbai - Domestic Airport (T1 Curbside Pickup / Drop)",
  "Navi Mumbai - Vashi / Belapur / Kharghar / Panvel",
  "Mumbai - Bandra Kurla Complex (BKC) / Bandra West",
  "Mumbai - South Mumbai (Marine Drive / Nariman Point / Colaba)",
  "Mumbai - Western Suburbs (Andheri / Juhu / Goregaon / Borivali)",
  "Mumbai - Central Suburbs (Powai / Ghatkopar / Thane / Mulund)",
  "Doorstep Delivery (Private Residence / 5-Star Hotel in Mumbai & MMR)",
  "Outstation Trip (Pune / Lonavala / Alibaug / Shirdi / Nashik)",
];
