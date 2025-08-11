// Google Apps Script for handling form submissions
// Deploy this as a web app to get a webhook URL

// ⚠️ IMPORTANT: REPLACE THIS WITH YOUR ACTUAL SPREADSHEET ID ⚠️
// To find your spreadsheet ID: look at the URL of your Google Sheet
// It will look like: https://docs.google.com/spreadsheets/d/YOUR_SPREADSHEET_ID_HERE/edit
// Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';

function doPost(e) {
  // Set CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  try {
    // Check if spreadsheet ID is configured
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Spreadsheet ID not configured. Please update SPREADSHEET_ID in the script.' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }

    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.email) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Email is required' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }
    
    // Get the spreadsheet by ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!spreadsheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'Spreadsheet not found. Please check your SPREADSHEET_ID.' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }
    
    const sheet = spreadsheet.getActiveSheet();
    if (!sheet) {
      return ContentService
        .createTextOutput(JSON.stringify({ success: false, error: 'No active sheet found in the spreadsheet.' }))
        .setMimeType(ContentService.MimeType.JSON)
        .setHeaders(headers);
    }
    
    // Extract the form data
    const name = data.name || '';
    const email = data.email || '';
    const city = data.city || '';
    const timestamp = new Date().toISOString();
    
    // Add the data to the sheet
    const rowData = [timestamp, name, email, city];
    sheet.appendRow(rowData);
    
    // Return a success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true, message: 'Data added successfully' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
      
  } catch (error) {
    // Return an error response
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders(headers);
  }
}

function doGet(e) {
  // Handle GET requests (for testing)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'Google Apps Script is running' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeaders(headers);
}

function doOptions(e) {
  // Handle CORS preflight requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };
  
  return ContentService
    .createTextOutput('')
    .setHeaders(headers);
}

// Function to set up the sheet headers (run this once)
function setupSheet() {
  try {
    // Check if spreadsheet ID is configured
    if (SPREADSHEET_ID === 'YOUR_SPREADSHEET_ID_HERE') {
      throw new Error('Spreadsheet ID not configured. Please update SPREADSHEET_ID in the script.');
    }

    // Get the spreadsheet by ID
    const spreadsheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    if (!spreadsheet) {
      throw new Error('Spreadsheet not found. Please check your SPREADSHEET_ID.');
    }
    
    const sheet = spreadsheet.getActiveSheet();
    if (!sheet) {
      throw new Error('No active sheet found in the spreadsheet.');
    }
    
    // Set up headers
    const headers = ['Timestamp', 'Name', 'Email', 'City'];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    
    // Format headers
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#f3f4f6');
    
    // Auto-resize columns
    sheet.autoResizeColumns(1, headers.length);
    
    console.log('Sheet headers set up successfully!');
    
  } catch (error) {
    console.error('Error in setupSheet:', error.toString());
    throw error;
  }
}
