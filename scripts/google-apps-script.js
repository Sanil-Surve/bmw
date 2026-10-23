/**
 * KALASH BMW CARS RENTAL PLATFORM - GOOGLE APPS SCRIPT
 * 
 * Instructions for setup:
 * 1. Open Google Sheets (https://sheets.new) and create a new spreadsheet.
 * 2. Name your spreadsheet (e.g., "Kalash BMW Cars Bookings").
 * 3. In the top menu, go to: Extensions > Apps Script.
 * 4. Delete any code in the editor and paste this entire file content.
 * 5. Click the "Save" icon (Ctrl+S or Cmd+S).
 * 6. Click "Deploy" > "New deployment".
 * 7. In the popup, click the gear icon (Select type) > Choose "Web app".
 * 8. Set Configuration:
 *    - Description: "Kalash BMW Cars Rental API"
 *    - Execute as: "Me (your email)"
 *    - Who has access: "Anyone" (IMPORTANT: so the Next.js app can submit & fetch bookings)
 * 9. Click "Deploy".
 * 10. Copy the "Web app URL" (ends with /exec).
 * 11. Add it to your `.env.local` file as:
 *     GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/XXXXX/exec"
 *     NEXT_PUBLIC_GOOGLE_APPS_SCRIPT_URL="https://script.google.com/macros/s/XXXXX/exec"
 */

const SHEET_NAME = "Bookings";

const HEADERS = [
  "Booking ID",
  "Created At",
  "Full Name",
  "Email",
  "Phone",
  "License Number",
  "Car Model",
  "Rental Type",
  "Pickup Date",
  "Pickup Time",
  "Dropoff Date",
  "Dropoff Time",
  "Pickup Location",
  "Dropoff Location",
  "Days",
  "Total Price ($)",
  "Status",
  "Notes"
];

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Remove default Sheet1 if empty
    const defaultSheet = ss.getSheetByName("Sheet1");
    if (defaultSheet && defaultSheet.getLastRow() === 0) {
      try { ss.deleteSheet(defaultSheet); } catch (e) {}
    }
  }

  // Ensure headers exist
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#111827");
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }

  return sheet;
}

// Handle GET requests (Fetch bookings for /admin dashboard)
function doGet(e) {
  try {
    const sheet = getOrCreateSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return createJsonResponse({ success: true, bookings: [] });
    }

    const headers = data[0];
    const rows = data.slice(1);

    const bookings = rows.map((row) => {
      return {
        id: String(row[0] || ""),
        createdAt: row[1] instanceof Date ? row[1].toISOString() : String(row[1] || ""),
        fullName: String(row[2] || ""),
        email: String(row[3] || ""),
        phone: String(row[4] || "").replace(/^'/, ""),
        licenseNumber: String(row[5] || ""),
        carName: String(row[6] || ""),
        rentalType: String(row[7] || "self-drive"),
        pickupDate: row[8] instanceof Date ? formatDate(row[8]) : String(row[8] || ""),
        pickupTime: formatTime(row[9]),
        dropoffDate: row[10] instanceof Date ? formatDate(row[10]) : String(row[10] || ""),
        dropoffTime: formatTime(row[11]),
        pickupLocation: String(row[12] || ""),
        dropoffLocation: String(row[13] || ""),
        days: Number(row[14]) || 1,
        totalPrice: Number(row[15]) || 0,
        status: String(row[16] || "pending").toLowerCase(),
        notes: String(row[17] || ""),
        source: "google_sheets"
      };
    });

    // Return newest bookings first
    bookings.reverse();

    return createJsonResponse({
      success: true,
      count: bookings.length,
      bookings: bookings
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

// Handle POST requests (Create or Update bookings)
function doPost(e) {
  try {
    const sheet = getOrCreateSheet();
    let body = {};
    if (e && e.postData && e.postData.contents) {
      body = JSON.parse(e.postData.contents);
    } else {
      body = e.parameter || {};
    }

    const action = body.action || "create";

    // Action: Update Status of existing booking
    if (action === "updateStatus") {
      const bookingId = body.id;
      const newStatus = body.status;

      const data = sheet.getDataRange().getValues();
      let updated = false;

      for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(bookingId)) {
          // Status is column index 16 (17th column, index 1-based is 17)
          sheet.getRange(i + 1, 17).setValue(newStatus);
          updated = true;
          break;
        }
      }

      if (updated) {
        return createJsonResponse({ success: true, message: "Status updated successfully" });
      } else {
        return createJsonResponse({ success: false, error: "Booking ID not found" });
      }
    }

    // Default Action: Create new booking
    const booking = body.data || body;
    const bookingId = booking.id || ("BMW-" + new Date().getFullYear() + "-" + Math.floor(1000 + Math.random() * 9000));
    const createdAt = booking.createdAt || new Date().toISOString();

    const rawPhone = String(booking.phone || "");
    const safePhone = rawPhone.startsWith("+") ? "'" + rawPhone : rawPhone;

    const rowData = [
      bookingId,
      createdAt,
      booking.fullName || "",
      booking.email || "",
      safePhone,
      booking.licenseNumber || "",
      booking.carName || booking.carId || "",
      booking.rentalType || "self-drive",
      booking.pickupDate || "",
      booking.pickupTime || "",
      booking.dropoffDate || "",
      booking.dropoffTime || "",
      booking.pickupLocation || "",
      booking.dropoffLocation || "",
      booking.days || 1,
      booking.totalPrice || 0,
      booking.status || "pending",
      booking.notes || ""
    ];

    sheet.appendRow(rowData);

    return createJsonResponse({
      success: true,
      message: "Booking recorded in Google Sheets successfully",
      bookingId: bookingId,
      booking: booking
    });
  } catch (error) {
    return createJsonResponse({
      success: false,
      error: error.toString()
    });
  }
}

function formatDate(date) {
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + "-" + month + "-" + day;
  } catch (e) {
    return String(date);
  }
}

function formatTime(val) {
  if (val instanceof Date) {
    try {
      const hours = String(val.getHours()).padStart(2, '0');
      const minutes = String(val.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    } catch (e) {
      return String(val);
    }
  }
  return String(val || "");
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
