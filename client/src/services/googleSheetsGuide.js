/**
 * GOOGLE SHEETS AUTO-SYNC GUIDE FOR WRON_WAVE CLOTHING
 * 
 * Follow these 3 simple steps to automatically log every customer order into your personal Google Sheet:
 * 
 * STEP 1: Create a Google Sheet
 * 1. Open Google Sheets (https://sheets.new).
 * 2. In row 1, set these column headers:
 *    A: Order ID | B: Date/Time | C: Customer Name | D: Phone | E: Address | F: Items & Sizes | G: Total (₹) | H: Payment | I: Channel | J: Status
 * 
 * STEP 2: Paste the Apps Script
 * 1. In Google Sheets, click: Extensions ➔ Apps Script.
 * 2. Delete any code in the editor and paste the code below:
 * 
 * -------------------------------------------------------------
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.orderId,
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    data.customerName,
    "'" + data.phone,
    data.address,
    data.itemsSummary,
    data.totalAmount,
    data.paymentMethod,
    data.channel,
    data.status
  ]);
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}
 * -------------------------------------------------------------
 * 
 * STEP 3: Deploy as Web App
 * 1. Click the blue "Deploy" button (top-right) ➔ "New deployment".
 * 2. Select type: "Web app".
 * 3. Set "Execute as": "Me".
 * 4. Set "Who has access": "Anyone".
 * 5. Click "Deploy" and copy the Web App URL!
 * 6. Paste that URL into your Vercel Environment Variables as VITE_GOOGLE_SHEETS_WEBHOOK_URL.
 */

export const GOOGLE_SHEETS_CODE = `function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.orderId,
    new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    data.customerName,
    "'" + data.phone,
    data.address,
    data.itemsSummary,
    data.totalAmount,
    data.paymentMethod,
    data.channel,
    data.status
  ]);
  return ContentService.createTextOutput(JSON.stringify({ result: 'success' }))
    .setMimeType(ContentService.MimeType.JSON);
}`;
