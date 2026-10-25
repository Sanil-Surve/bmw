export { cn } from "cn";

/**
 * Format a number into Indian Rupee currency format (e.g., ₹35,000 or ₹1,05,000)
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Extract 10-digit Indian mobile number from various user inputs
 * Handles prefixes like +91, 91, or leading 0, plus spaces and hyphens
 */
export function extractIndianMobile(phone: string): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length === 11 && digits.startsWith("0")) {
    return digits.slice(1);
  }
  return digits;
}

/**
 * Checks if the phone number is a valid 10-digit Indian mobile number
 * Valid Indian mobile numbers are 10 digits starting with 6, 7, 8, or 9
 */
export function isValidIndianMobile(phone: string): boolean {
  const digits = extractIndianMobile(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Formats 10-digit Indian mobile number as +91 XXXXX XXXXX
 */
export function formatIndianMobile(phone: string): string {
  const digits = extractIndianMobile(phone);
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

/**
 * Format phone number for WhatsApp direct link (wa.me/91XXXXXXXXXX)
 */
export function getWhatsAppNumber(phone: string): string {
  if (!phone || phone.includes("#ERROR")) return "";
  const extracted = extractIndianMobile(phone);
  if (extracted.length === 10) {
    return `91${extracted}`;
  }
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) {
    return digits.startsWith("91") && digits.length === 12 ? digits : (digits.length === 10 ? `91${digits}` : digits);
  }
  return "";
}
