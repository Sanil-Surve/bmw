import { CarModel } from "@/types/booking";

export const CHAUFFEUR_DAILY_RATE = 2500; // ₹2,500/day VIP professional chauffeur surcharge

export const FLEET_CARS: CarModel[] = [
  {
    id: "bmw-m4-competition",
    name: "BMW M4 Competition Coupé",
    modelCode: "G82",
    category: "M Performance",
    pricePerDay: 35000, // ₹35,000/day
    image: "/bmw.webp",
    tagline: "Track-bred ferocity with twin-turbocharged Munich precision.",
    badge: "Most Popular",
    specs: {
      power: "503 HP",
      acceleration: "3.5s (0-100 km/h)",
      transmission: "8-Speed M Steptronic",
      topSpeed: "290 km/h",
      seats: 4,
      fuelType: "TwinPower Turbo Petrol (XP95)",
    },
    features: [
      "M Carbon Bucket Seats",
      "M xDrive with 2WD Track Mode",
      "Harman Kardon Surround Sound",
      "Head-Up Display & FASTag Equipped",
    ],
  },
  {
    id: "bmw-m5-cs",
    name: "BMW M5 CS Super Sedan",
    modelCode: "F90 CS",
    category: "M Performance",
    pricePerDay: 48000, // ₹48,000/day
    image: "/bmw.webp",
    tagline: "The fastest, most potent M production supercar sedan ever conceived.",
    badge: "Ultimate Beast",
    specs: {
      power: "627 HP",
      acceleration: "3.0s (0-100 km/h)",
      transmission: "8-Speed M Steptronic",
      topSpeed: "305 km/h",
      seats: 4,
      fuelType: "4.4L Twin-Turbo V8 Petrol (XP95/Power99)",
    },
    features: [
      "Carbon-Fiber Hood & Ceramic Brakes",
      "Exclusive Gold Bronze Accents",
      "Individual Rear Bucket Seats",
      "FASTag Pre-loaded & Active M Differential",
    ],
  },
  {
    id: "bmw-i8-roadster",
    name: "BMW i8 Roadster",
    modelCode: "I15",
    category: "Supercar / Hybrid",
    pricePerDay: 42000, // ₹42,000/day
    image: "/bmw.webp",
    tagline: "Iconic butterfly doors meet electrifying plug-in hybrid performance.",
    badge: "Exotic Roadster",
    specs: {
      power: "369 HP Combined",
      acceleration: "4.4s (0-100 km/h)",
      transmission: "6-Speed Automatic + eDrive",
      topSpeed: "250 km/h",
      seats: 2,
      fuelType: "Plug-In Hybrid Electric (Petrol + EV)",
    },
    features: [
      "Carbon Fiber Passenger Cell",
      "Dihedral Butterfly Doors",
      "All-Wheel Electric Drive",
      "Type-2 Home Charger Kit Included",
    ],
  },
  {
    id: "bmw-x5-m",
    name: "BMW X5 M Competition",
    modelCode: "F95",
    category: "Performance SUV",
    pricePerDay: 32000, // ₹32,000/day
    image: "/bmw.webp",
    tagline: "Supercar performance concealed inside a commanding luxury SUV.",
    badge: "Luxury SUV",
    specs: {
      power: "617 HP",
      acceleration: "3.8s (0-100 km/h)",
      transmission: "8-Speed M Steptronic",
      topSpeed: "285 km/h",
      seats: 5,
      fuelType: "4.4L V8 TwinPower Petrol (XP95)",
    },
    features: [
      "Panoramic Sky Lounge LED Roof",
      "M Sport Exhaust System",
      "Adaptive M Suspension for Indian Expressways",
      "Massive 5-Seat Luggage Space & FASTag",
    ],
  },
  {
    id: "bmw-760i-executive",
    name: "BMW 760i xDrive Executive",
    modelCode: "G70",
    category: "Luxury Sedan",
    pricePerDay: 38000, // ₹38,000/day
    image: "/bmw.webp",
    tagline: "First-class executive elegance with 31.3” 8K Theater Screen lounge.",
    badge: "Chauffeur Ready",
    specs: {
      power: "536 HP",
      acceleration: "4.2s (0-100 km/h)",
      transmission: "8-Speed Steptronic",
      topSpeed: "250 km/h",
      seats: 5,
      fuelType: "TwinPower Turbo V8 Petrol",
    },
    features: [
      '31.3" 8K BMW Theater Screen in Rear',
      "Automatic Soft-Close Doors",
      "Bowers & Wilkins Diamond Surround Sound",
      "Executive Lounge Recliner & Chauffeur Option",
    ],
  },
  {
    id: "bmw-m2-coupe",
    name: "BMW M2 Coupé",
    modelCode: "G87",
    category: "M Performance",
    pricePerDay: 25000, // ₹25,000/day
    image: "/bmw.webp",
    tagline: "Agile, aggressive rear-wheel-drive pure driving joy.",
    specs: {
      power: "453 HP",
      acceleration: "4.1s (0-100 km/h)",
      transmission: "8-Speed M Steptronic w/ Paddle Shifters",
      topSpeed: "280 km/h",
      seats: 4,
      fuelType: "3.0L M TwinPower Turbo Petrol",
    },
    features: [
      "Pure Rear-Wheel-Drive Agility",
      "Compact Lightweight Chassis",
      "M Drift Analyzer & Laptimer",
      "Curved Display with iDrive 8 & FASTag",
    ],
  },
];

export const POPULAR_LOCATIONS = [
  "Mumbai - CSMI Airport (T2 VIP Meet & Greet)",
  "Mumbai - Bandra Kurla Complex (BKC) / South Mumbai Delivery",
  "Delhi NCR - IGI Airport (T3 VIP Curbside Meet & Greet)",
  "Delhi NCR - Aerocity / CyberCity / Diplomatic Enclave",
  "Bengaluru - Kempegowda Intl Airport (VIP Terminal)",
  "Bengaluru - UB City / Indiranagar / Whitefield Delivery",
  "Hyderabad - Rajiv Gandhi Intl Airport / HITEC City",
  "Pune - Koregaon Park / Pune Airport Meet & Greet",
  "Goa - Manohar Intl (Mopa) / Dabolim Airport & Resort Delivery",
  "Doorstep Delivery (Private Residence / Luxury Villa Across Metros)",
];
