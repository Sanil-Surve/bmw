/**
 * KALASH BMW CARS RENTAL PLATFORM - GOOGLE APPS SCRIPT
 * 
 * Instructions for setup / update:
 * 1. Open your Google Sheet (https://sheets.new or your existing sheet).
 * 2. In the top menu, go to: Extensions > Apps Script.
 * 3. Replace all existing code in the editor with this entire file.
 * 4. Click the "Save" icon (Ctrl+S / Cmd+S).
 * 5. (Optional but recommended if you have existing #ERROR! cells):
 *    - In the toolbar dropdown select "repairExistingPhoneErrors", then click "Run".
 *    - This instantly fixes any existing "#ERROR!" cells in Column E.
 * 6. Click "Deploy" > "Manage deployments" > Edit (pencil icon) > New version > "Deploy".
 *    (Or "Deploy" > "New deployment" > Select type: "Web app").
 * 7. Ensure Configuration:
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 * 8. Copy the Web app URL (ends with /exec) and save it in the Admin Dashboard Settings or `.env.local`.
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
  "Total Price (₹)",
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
    headerRange.setBackground("#0F2825");
    headerRange.setFontColor("#FAF7F0");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    sheet.setFrozenRows(1);
  }

  // CRITICAL: Force Column E (Phone) and Column A (Booking ID) to Plain Text
  // This prevents Google Sheets from treating "+91..." as a mathematical formula
  sheet.getRange("A:A").setNumberFormat("@");
  sheet.getRange("E:E").setNumberFormat("@");

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

    const rows = data.slice(1);

    const bookings = rows.map((row) => {
      // Clean phone number from leading apostrophes or formula errors
      let rawPhone = String(row[4] || "").trim();
      let cleanPhone = rawPhone.replace(/^'+/, "");
      if (cleanPhone === "#ERROR!" || cleanPhone.startsWith("#")) {
        cleanPhone = "";
      }

      return {
        id: String(row[0] || ""),
        createdAt: row[1] instanceof Date ? row[1].toISOString() : String(row[1] || ""),
        fullName: String(row[2] || ""),
        email: String(row[3] || ""),
        phone: cleanPhone,
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

    // CRITICAL: Strip any existing single quotes, then prepend single quote (')
    // Prepending ' tells Google Sheets to treat the value strictly as text, avoiding #ERROR!
    const rawPhone = String(booking.phone || "").trim().replace(/^'+/, "");
    const safePhone = rawPhone ? "'" + rawPhone : "";

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

    // Enforce Plain Text number format on the newly appended phone cell
    const lastRow = sheet.getLastRow();
    sheet.getRange(lastRow, 5).setNumberFormat("@");

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

/**
 * Utility Function: Run this function directly in Apps Script to repair existing #ERROR! cells
 * In the Google Apps Script toolbar: select "repairExistingPhoneErrors" and click "Run".
 */
function repairExistingPhoneErrors() {
  const sheet = getOrCreateSheet();
  sheet.getRange("E:E").setNumberFormat("@");
  const data = sheet.getDataRange().getValues();
  let repaired = 0;

  for (let i = 1; i < data.length; i++) {
    const rawVal = String(data[i][4] || "").trim();
    const cell = sheet.getRange(i + 1, 5);

    if (rawVal === "#ERROR!" || rawVal.startsWith("#")) {
      // Clear formula error and set placeholder as plain text
      cell.setNumberFormat("@").setValue("Format error in sheet - please update");
      repaired++;
    } else if (rawVal && !rawVal.startsWith("'")) {
      cell.setNumberFormat("@").setValue("'" + rawVal.replace(/^'+/, ""));
      repaired++;
    }
  }

  Logger.log("Successfully repaired " + repaired + " phone cells.");
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
