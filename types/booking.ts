export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface RentalPackage {
  id: string;
  name: string;
  durationText: string;
  hours: number;
  distanceKm: number;
  price: number;
  badge?: string;
  popular?: boolean;
  description: string;
  category: 'duty' | 'transfer' | 'multiday';
}

export interface CarModel {
  id: string;
  name: string;
  modelCode: string;
  category: 'Luxury Sedan' | 'Weddings & VIP' | 'Airport Transfer' | 'Corporate Travel';
  pricePerDay: number;
  image: string;
  specs: {
    power: string;
    acceleration: string;
    transmission: string;
    topSpeed: string;
    seats: number;
    fuelType: string;
  };
  features: string[];
  tagline: string;
  badge?: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  carId: string;
  carName: string;
  packageId?: string;
  packageName?: string;
  carImage?: string;
  carDailyRate: number;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  rentalType: 'self-drive' | 'chauffeur';
  days: number;
  totalPrice: number;
  status: BookingStatus;
  notes?: string;
  source?: 'google_sheets' | 'local_store';
}

export interface BookingFormData {
  fullName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  carId: string;
  packageId?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  rentalType: 'self-drive' | 'chauffeur';
  notes?: string;
}
