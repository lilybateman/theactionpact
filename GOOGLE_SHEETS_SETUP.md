# Google Sheets Integration Setup Guide

This guide will help you set up automatic form submissions to Google Sheets.

## 🎯 Quick Overview
When someone submits your form, their information will automatically appear in a Google Sheet with columns for: Timestamp, Name, Email, and City.

---

## Step 1: Create a Google Sheet 📊

1. **Go to Google Sheets**: Open [sheets.google.com](https://sheets.google.com) in your browser
2. **Create New Sheet**: Click the "+" button or "Blank" to create a new spreadsheet
3. **Name Your Sheet**: Click on "Untitled spreadsheet" at the top and rename it to "Action Pact Newsletter Signups"
4. **Note the URL**: Look at the URL in your browser - it will look like this:
   ```
   https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
   ```
   The long string between `/d/` and `/edit` is your spreadsheet ID (you'll need this later)

---

## Step 2: Create Google Apps Script 🔧

1. **Go to Google Apps Script**: Open [script.google.com](https://script.google.com) in your browser
2. **Create New Project**: Click "New Project" (or the "+" button)
3. **Delete Default Code**: Delete ALL the default code that appears (usually just a `function myFunction()` placeholder)
4. **Copy the Script**: Open the `google-apps-script.js` file from your project folder and copy **ALL** the contents
5. **Paste the Code**: Paste the entire contents into the Google Apps Script editor
6. **Save Project**: Click "Save" (or Ctrl+S) and name it "Action Pact Form Handler"

### 🔍 **Important: Copy the ENTIRE file contents**

Make sure you copy **everything** from the `google-apps-script.js` file, including:
- `doPost(e)` function
- `doGet(e)` function  
- `doOptions(e)` function
- `setupSheet()` function

**If you see "no functions" error**: This means you didn't copy the complete code. Make sure you copied the entire file contents, not just part of it.

---

## Step 3: Set Up Sheet Headers 📋

1. **In Google Apps Script**: Make sure you're in the Apps Script editor
2. **Select Function**: 
   - Click on the function dropdown (next to "Debug" button) - you should see `setupSheet` listed
   - Select `setupSheet` from the dropdown
3. **Run Setup Function**: 
   - Click the "Run" button (▶️)
   - If prompted, click "Review Permissions" and then "Allow"
   - Authorize the script to access your Google Sheets when prompted
4. **Check Your Sheet**: Go back to your Google Sheet - you should now see headers: Timestamp, Name, Email, City

### 🔍 **If you don't see `setupSheet` in the dropdown**:
- Make sure you copied the **entire** contents of `google-apps-script.js`
- Try refreshing the page
- Check that the code was saved properly

---

## Step 4: Deploy as Web App 🌐

1. **Deploy Button**: In Google Apps Script, click the "Deploy" button (top right)
2. **New Deployment**: Click "New deployment"
3. **Configure Settings**:
   - **Type**: Select "Web app"
   - **Execute as**: Choose "Me" (your Google account)
   - **Who has access**: Select "Only myself" (recommended for security) or "Anyone" (if you want others to access it)
   - **Description**: "Action Pact Form Handler v1" (optional)
4. **Deploy**: Click "Deploy"
5. **Authorize**: If prompted, click "Authorize access" and follow the prompts
6. **Copy Webhook URL**: After deployment, you'll see a web app URL - **copy this URL** (it looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 🔒 Security Options

**"Only myself" (Recommended)**:
- ✅ Most secure option
- ✅ Only you can access the webhook
- ✅ Perfect for personal projects
- ✅ No one else can use your webhook URL

**"Anyone"**:
- ⚠️ Less secure
- ⚠️ Anyone with the URL can access it
- ⚠️ Only use if you need public access
- ⚠️ Good for testing or public APIs

**For your Action Pact project, "Only myself" is the best choice!** 🎯

---

## Step 5: Update Your Code 💻

1. **Open Your Project**: In your code editor, open `src/pages/Index.tsx`
2. **Find the Webhook URL**: Look for this line (around line 70):
   ```typescript
   const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/a/macros/theactionpact.ca/s/AKfycbxxkDnQbHsSn3e3pXB0KRd47-dS6ABZLgqDRkzDWNyGS9tmJ6hbOK92aQrOVTWbj57j/exec';
   ```
3. **Replace the URL**: Replace `'YOUR_GOOGLE_APPS_SCRIPT_WEBHOOK_URL_HERE'` with your actual webhook URL from Step 4:
   ```typescript
   const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || 'https://script.google.com/a/macros/theactionpact.ca/s/AKfycbxxkDnQbHsSn3e3pXB0KRd47-dS6ABZLgqDRkzDWNyGS9tmJ6hbOK92aQrOVTWbj57j/exec';
   ```

---

## Step 6: Test the Integration ✅

1. **Start Your Server**: Run `npm run dev` in your terminal
2. **Open Your Site**: Go to `http://localhost:8080` (or whatever port it shows)
3. **Fill Out Form**: Enter a test name, email, and city
4. **Submit Form**: Click the submit button
5. **Check Google Sheet**: Go back to your Google Sheet - you should see a new row with your test data!

---

## 🔧 Troubleshooting

### "Cloud Platform project" Error
**Error**: "We're sorry, there was an unexpected error while creating the Cloud Platform project. Error code INTERNAL."

**Solutions**:
1. **Wait and retry**: This is often a temporary Google issue. Wait 5-10 minutes and try again
2. **Clear browser cache**: Clear your browser cache and cookies, then try again
3. **Use incognito mode**: Open Google Apps Script in an incognito/private window
4. **Check Google account**: Make sure you're signed into the correct Google account
5. **Alternative approach**: 
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project manually
   - Go back to Apps Script and try again

### "No functions" Error
- **Cause**: You didn't copy the complete code from `google-apps-script.js`
- **Solution**: Copy the **entire** file contents, not just part of it
- **Check**: You should see 4 functions: `doPost`, `doGet`, `doOptions`, and `setupSheet`

### "Webhook URL not configured" Message
- This is normal if you haven't set up the webhook URL yet
- The form will still work, but data won't be saved to Google Sheets

### CORS Errors
- Make sure your Google Apps Script is deployed as a "Web app"
- Ensure "Who has access" is set to "Anyone"

### Permission Denied
- Make sure you're signed into the correct Google account
- Re-authorize the Apps Script when prompted

### Data Not Appearing in Sheet
- Check that you ran the `setupSheet()` function
- Verify the webhook URL is correct
- Check the browser console for error messages

---

## 🎯 What You'll See

### In Your Google Sheet:
| Timestamp | Name | Email | City |
|-----------|------|-------|------|
| 2024-01-15T10:30:00.000Z | John Doe | john@example.com | New York |
| 2024-01-15T11:45:00.000Z | Jane Smith | jane@example.com | Los Angeles |

### In Your Form:
- Users get instant feedback when they submit
- Data is automatically sent to Google Sheets
- Form resets after successful submission

---

## 🚀 Next Steps

Once this is working, you can:
- **Customize the sheet**: Add more columns, formatting, or formulas
- **Set up notifications**: Get email alerts when new submissions come in
- **Export data**: Download your data as CSV or Excel files
- **Share access**: Give team members access to view the sheet

---

## 💡 Pro Tips

- **Backup your data**: Google Sheets automatically saves, but you can export regularly
- **Test thoroughly**: Try submitting forms with different data to ensure everything works
- **Monitor usage**: Check your Google Apps Script execution logs if something goes wrong
- **Keep URLs secure**: Don't share your webhook URL publicly (though it's not super sensitive for this use case)

---

**Need help?** Check the browser console (F12) for error messages, or refer to the troubleshooting section above!
