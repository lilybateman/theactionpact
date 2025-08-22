# Google Sheets Integration Troubleshooting Guide

## 🔍 Quick Diagnosis

### Step 1: Check Browser Console
1. Open your website in the browser
2. Open Developer Tools (F12 or right-click → Inspect)
3. Go to the **Console** tab
4. Submit a test form
5. Look for any error messages

### Step 2: Check Network Tab
1. In Developer Tools, go to the **Network** tab
2. Submit a test form
3. Look for the request to your Google Apps Script URL
4. Check if it's successful (200) or failed (4xx/5xx)

## 🚨 Common Issues & Solutions

### Issue 1: "Google Sheets webhook URL not configured, skipping..."
**Cause**: The webhook URL is still set to the default/placeholder
**Solution**: 
1. Check if you have a `.env` file in your project root
2. Add this line to your `.env` file:
   ```
   VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
   ```
3. Replace `YOUR_ACTUAL_SCRIPT_ID` with your actual Google Apps Script ID

### Issue 2: "Spreadsheet ID not configured"
**Cause**: The Google Apps Script still has the placeholder spreadsheet ID
**Solution**:
1. Open your Google Apps Script project
2. Find the line: `const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';`
3. Replace `YOUR_SPREADSHEET_ID_HERE` with your actual spreadsheet ID
4. Save and redeploy the script

### Issue 3: "Spreadsheet not found"
**Cause**: The spreadsheet ID is incorrect or the script doesn't have access
**Solution**:
1. Make sure the spreadsheet ID is correct (check the URL of your Google Sheet)
2. Ensure the Google Apps Script has permission to access the spreadsheet
3. Make sure the spreadsheet is shared with the Google account running the script

### Issue 4: CORS Errors
**Cause**: The Google Apps Script isn't handling CORS properly
**Solution**:
1. Make sure your Google Apps Script has the `doOptions` function
2. Ensure the script is deployed as a web app with proper access settings
3. Check that the CORS headers are being set correctly

### Issue 5: "HTTP error! status: 403"
**Cause**: The web app isn't accessible or requires authentication
**Solution**:
1. Make sure the Google Apps Script is deployed as a web app
2. Set the access to "Anyone" or "Anyone with Google Account"
3. Make sure the script is published as a web app (not just saved)

## 🔧 Step-by-Step Fix

### 1. Update Google Apps Script
1. Go to [Google Apps Script](https://script.google.com/)
2. Open your project
3. Replace the `SPREADSHEET_ID` with your actual spreadsheet ID:
   ```javascript
   const SPREADSHEET_ID = '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms'; // Your actual ID
   ```
4. Save the script
5. Deploy as a new version:
   - Click "Deploy" → "New deployment"
   - Choose "Web app"
   - Set "Execute as" to your account
   - Set "Who has access" to "Anyone"
   - Click "Deploy"
6. Copy the new web app URL

### 2. Update Environment Variable
1. Create a `.env` file in your project root (if it doesn't exist)
2. Add this line:
   ```
   VITE_GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/YOUR_NEW_SCRIPT_ID/exec
   ```
3. Replace `YOUR_NEW_SCRIPT_ID` with the ID from your new deployment
4. Restart your development server

### 3. Test the Integration
1. Open your website
2. Open Developer Tools (F12)
3. Go to Console tab
4. Submit a test form
5. Check for any error messages
6. Check the Network tab for the request to Google Apps Script

## 📊 Debug Information

### Check Current Configuration
Look at these files to see your current setup:

1. **Webhook URL**: Check `src/pages/Index.tsx` line 149
2. **Spreadsheet ID**: Check `google-apps-script.js` line 6
3. **Environment Variables**: Check for `.env` file in project root

### Test the Webhook URL
1. Open your webhook URL in a browser
2. You should see: `{"status":"Google Apps Script is running"}`
3. If you see an error, the script isn't deployed correctly

### Test with curl
```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","city":"Test City"}' \
  https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
```

## 🆘 Still Not Working?

If you're still having issues:

1. **Check the Google Apps Script logs**:
   - Open your Google Apps Script project
   - Go to "Executions" in the left sidebar
   - Look for any failed executions and error messages

2. **Verify spreadsheet permissions**:
   - Make sure your Google account has edit access to the spreadsheet
   - Try sharing the spreadsheet with your Google account explicitly

3. **Check the deployment**:
   - Make sure the script is deployed as a web app (not just saved)
   - Verify the deployment URL is correct
   - Make sure the access settings are correct

4. **Test with a simple script**:
   - Create a new Google Apps Script project
   - Copy the code from `google-apps-script.js`
   - Deploy it as a web app
   - Test with the new URL

## 📞 Need Help?

If you're still stuck, please provide:
1. The exact error message from the browser console
2. The network request details (status code, response)
3. Your Google Apps Script deployment URL (you can share it - it's public)
4. Whether you can access the webhook URL directly in a browser








