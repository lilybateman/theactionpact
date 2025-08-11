# 📊 How to Find Your Spreadsheet ID

## 🎯 What You Need to Replace

In the `google-apps-script.js` file, you need to replace this line:
```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```

With your actual spreadsheet ID.

---

## 🔍 How to Find Your Spreadsheet ID

### Step 1: Open Your Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com)
2. Open your "Action Pact Newsletter Signups" sheet (or whatever you named it)

### Step 2: Look at the URL
The URL in your browser will look like this:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
```

### Step 3: Copy the Spreadsheet ID
The spreadsheet ID is the long string between `/d/` and `/edit`:
```
https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
                                    ↑
                              This is your ID
```

**In this example, the spreadsheet ID is:** `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

---

## 🔧 How to Update Your Code

### Step 1: Open the Script File
1. Open `google-apps-script.js` in your project
2. Find this line (around line 6):
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```

### Step 2: Replace with Your ID
Replace `'YOUR_SPREADSHEET_ID_HERE'` with your actual spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
   ```

### Step 3: Save and Test
1. Save the file
2. Copy the updated code to Google Apps Script
3. Run the `setupSheet()` function to test

---

## ✅ Example

**Before:**
```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```

**After:**
```javascript
const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
```

---

## 🎯 What This Does

- **`SpreadsheetApp.openById(SPREADSHEET_ID)`** - Opens your specific Google Sheet using its ID
- **`spreadsheet.getActiveSheet()`** - Gets the first (or currently active) sheet in your spreadsheet
- **`sheet.appendRow(rowData)`** - Adds a new row with your form data

---

## 🔍 Troubleshooting

### "Spreadsheet not found" Error
- **Cause**: Wrong spreadsheet ID
- **Solution**: Double-check the ID from your Google Sheet URL

### "Permission denied" Error
- **Cause**: Script doesn't have access to the spreadsheet
- **Solution**: Make sure you're signed into the correct Google account

### "Sheet not found" Error
- **Cause**: The sheet might be named differently
- **Solution**: The script uses `getActiveSheet()` which gets the first sheet by default

---

## 🚀 Next Steps

Once you've updated the spreadsheet ID:
1. **Copy the updated code** to Google Apps Script
2. **Run `setupSheet()`** to create headers
3. **Deploy as web app** to get your webhook URL
4. **Test the integration** with a form submission

**Your spreadsheet ID is unique to your Google Sheet - make sure you're using the correct one!** 🎯

