# 🚨 Quick Fix: Spreadsheet ID Error

## The Problem
**Error**: `TypeError: Cannot read properties of null (reading 'getActiveSheet')`

This happens because you haven't replaced the placeholder spreadsheet ID with your actual one.

---

## 🔧 Quick Fix (3 Steps)

### Step 1: Find Your Spreadsheet ID
1. **Open your Google Sheet** - Go to [sheets.google.com](https://sheets.google.com)
2. **Look at the URL** - It will look like this:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
3. **Copy the ID** - The long string between `/d/` and `/edit`:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
                                    ↑
                              This is your ID
   ```

### Step 2: Update the Script
1. **Open Google Apps Script** - Go to [script.google.com](https://script.google.com)
2. **Find this line** (around line 7):
   ```javascript
   const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
   ```
3. **Replace it** with your actual ID:
   ```javascript
   const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
   ```

### Step 3: Test
1. **Save the script** - Click "Save" (Ctrl+S)
2. **Run setupSheet()** - Select `setupSheet` from dropdown and click "Run"
3. **Check for success** - You should see "Sheet headers set up successfully!" in the logs

---

## ✅ Example

**Before (causing error):**
```javascript
const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
```

**After (working):**
```javascript
const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms';
```

---

## 🎯 What This Does

- **`SpreadsheetApp.openById(SPREADSHEET_ID)`** - Opens your specific Google Sheet
- **`spreadsheet.getActiveSheet()`** - Gets the first sheet in your spreadsheet
- **`sheet.appendRow(rowData)`** - Adds your form data as a new row

---

## 🔍 Troubleshooting

### Still Getting Errors?
1. **Double-check the ID** - Make sure you copied the entire ID from the URL
2. **Check permissions** - Make sure you're signed into the correct Google account
3. **Verify the sheet exists** - Make sure your Google Sheet is actually created

### "Spreadsheet not found" Error
- **Cause**: Wrong spreadsheet ID
- **Solution**: Double-check the ID from your Google Sheet URL

### "Permission denied" Error
- **Cause**: Script doesn't have access to the spreadsheet
- **Solution**: Make sure you're signed into the correct Google account

---

## 🚀 Next Steps

Once you've fixed the spreadsheet ID:
1. **Run `setupSheet()`** - This will create the headers
2. **Deploy as web app** - Get your webhook URL
3. **Update your code** - Add the webhook URL to your project
4. **Test the integration** - Submit a form and check your Google Sheet

**The key is replacing `'YOUR_SPREADSHEET_ID_HERE'` with your actual spreadsheet ID!** 🎯
