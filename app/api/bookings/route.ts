import { NextRequest, NextResponse } from "next/server";
import { Booking, BookingFormData } from "@/types/booking";
import { FLEET_CARS, CHAUFFEUR_DAILY_RATE } from "@/lib/fleet";
import {
  getLocalBookings,
  addLocalBooking,
  updateLocalBookingStatus,
  getGoogleScriptUrl,
} from "@/lib/storage";
import { isValidIndianMobile, formatIndianMobile } from "@/lib/utils";

export async function GET(req: NextRequest) {
  try {
    const customUrl = req.headers.get("x-google-script-url") || req.nextUrl.searchParams.get("scriptUrl");
    const scriptUrl = getGoogleScriptUrl(customUrl);

    let bookings: Booking[] = [];
    let isGoogleSheetsConnected = false;
    let googleSheetError: string | null = null;

    if (scriptUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000);

        const response = await fetch(scriptUrl, {
          method: "GET",
          signal: controller.signal,
          redirect: "follow",
          cache: "no-store",
        });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && Array.isArray(data.bookings)) {
            bookings = data.bookings.map((b: Booking) => {
              const rawPhone = b.phone ? String(b.phone).replace(/^'+/, "").trim() : "";
              const cleanPhone = rawPhone === "#ERROR!" || rawPhone.startsWith("#") ? "" : rawPhone;
              return {
                ...b,
                phone: cleanPhone,
              };
            });
            isGoogleSheetsConnected = true;
          } else {
            googleSheetError = data?.error || "Google Apps Script returned unexpected response structure.";
          }
        } else {
          googleSheetError = `HTTP error ${response.status} from Google Apps Script.`;
        }
      } catch (err: unknown) {
        googleSheetError = err instanceof Error ? err.message : "Failed to connect to Google Sheets.";
      }
    }

    // If not connected or sheets has 0 bookings, fallback to local bookings
    if (!isGoogleSheetsConnected || bookings.length === 0) {
      const local = getLocalBookings();
      if (bookings.length === 0) {
        bookings = local;
      } else {
        // Merge without duplicates
        const existingIds = new Set(bookings.map((b) => b.id));
        const missingLocal = local.filter((b) => !existingIds.has(b.id));
        bookings = [...bookings, ...missingLocal];
      }
    }

    return NextResponse.json({
      success: true,
      isGoogleSheetsConnected,
      googleSheetError,
      hasConfiguredUrl: Boolean(scriptUrl),
      count: bookings.length,
      bookings,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as BookingFormData & { scriptUrl?: string };
    const customUrl = req.headers.get("x-google-script-url") || body.scriptUrl;
    const scriptUrl = getGoogleScriptUrl(customUrl);

    // Validation
    if (!body.fullName || !body.email || !body.phone || !body.carId) {
      return NextResponse.json(
        { success: false, error: "Please fill in all required fields (Name, Email, Mobile Number, Car Model)." },
        { status: 400 }
      );
    }

    // Indian 10-digit mobile number validation
    if (!isValidIndianMobile(body.phone)) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid 10-digit Indian mobile number (e.g. 98201 54920 or +91 98201 54920).",
        },
        { status: 400 }
      );
    }

    const formattedPhone = formatIndianMobile(body.phone);
    const selectedCar = FLEET_CARS.find((c) => c.id === body.carId) || FLEET_CARS[0];

    // Calculate duration in days
    const pickup = new Date(body.pickupDate || Date.now());
    const dropoff = new Date(body.dropoffDate || Date.now());
    const diffTime = Math.max(dropoff.getTime() - pickup.getTime(), 1000 * 60 * 60 * 24);
    const calculatedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    const chauffeurSurcharge = body.rentalType === "chauffeur" ? CHAUFFEUR_DAILY_RATE * calculatedDays : 0;
    const totalPrice = selectedCar.pricePerDay * calculatedDays + chauffeurSurcharge;

    const bookingId = `BMW-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      createdAt: new Date().toISOString(),
      fullName: body.fullName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: formattedPhone,
      licenseNumber: body.licenseNumber?.trim() || "Not Provided",
      carId: selectedCar.id,
      carName: selectedCar.name,
      carImage: selectedCar.image,
      carDailyRate: selectedCar.pricePerDay,
      pickupDate: body.pickupDate || new Date().toISOString().split("T")[0],
      pickupTime: body.pickupTime || "10:00",
      dropoffDate: body.dropoffDate || new Date(Date.now() + 86400000).toISOString().split("T")[0],
      dropoffTime: body.dropoffTime || "18:00",
      pickupLocation: body.pickupLocation || "Mumbai - CSMI Airport (T2 VIP Meet & Greet)",
      dropoffLocation: body.dropoffLocation || body.pickupLocation || "Mumbai - CSMI Airport (T2 VIP Meet & Greet)",
      rentalType: body.rentalType || "self-drive",
      days: calculatedDays,
      totalPrice,
      status: "pending",
      notes: body.notes?.trim() || "",
      source: "local_store",
    };

    // Save in local in-memory store
    addLocalBooking(newBooking);

    // Sync to Google Apps Script if URL is available
    let syncedToGoogleSheets = false;
    let googleSheetError: string | null = null;

    if (scriptUrl) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const gasResponse = await fetch(scriptUrl, {
          method: "POST",
          signal: controller.signal,
          redirect: "follow",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "create",
            data: {
              ...newBooking,
              phone: newBooking.phone.replace(/^'+/, ""),
            },
          }),
        });
        clearTimeout(timeoutId);

        if (gasResponse.ok) {
          const gasData = await gasResponse.json();
          if (gasData && gasData.success) {
            syncedToGoogleSheets = true;
            newBooking.source = "google_sheets";
          } else {
            googleSheetError = gasData?.error || "Google Apps Script rejected the booking.";
          }
        } else {
          googleSheetError = `HTTP error ${gasResponse.status} from Google Apps Script.`;
        }
      } catch (err: unknown) {
        googleSheetError = err instanceof Error ? err.message : "Network error syncing to Google Sheets.";
      }
    }

    return NextResponse.json({
      success: true,
      message: "Booking submitted successfully!",
      booking: newBooking,
      syncedToGoogleSheets,
      googleSheetError,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status, scriptUrl: bodyScriptUrl } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: "Missing booking ID or status." }, { status: 400 });
    }

    // Update in local store
    updateLocalBookingStatus(id, status);

    // If Google Apps Script is configured, forward status update
    const customUrl = req.headers.get("x-google-script-url") || bodyScriptUrl;
    const scriptUrl = getGoogleScriptUrl(customUrl);

    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          redirect: "follow",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "updateStatus", id, status }),
        });
      } catch (e) {
        console.warn("Failed to update status in Google Apps Script:", e);
      }
    }

    return NextResponse.json({ success: true, id, status });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
