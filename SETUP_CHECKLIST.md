# 🎯 Google Sheets Setup Checklist

## ✅ Step-by-Step Checklist

### Step 1: Google Sheet
- [ ] Created new Google Sheet at [sheets.google.com](https://sheets.google.com)
- [ ] Named it "Action Pact Newsletter Signups"
- [ ] Noted the spreadsheet ID from URL

### Step 2: Google Apps Script
- [ ] Went to [script.google.com](https://script.google.com)
- [ ] Created new project
- [ ] Replaced default code with `google-apps-script.js` content
- [ ] Saved project as "Action Pact Form Handler"

### Step 3: Sheet Headers
- [ ] Ran `setupSheet()` function in Apps Script
- [ ] Authorized script access to Google Sheets
- [ ] Verified headers appear in Google Sheet: Timestamp, Name, Email, City

### Step 4: Deploy Web App
- [ ] Clicked "Deploy" > "New deployment"
- [ ] Set type to "Web app"
- [ ] Set "Execute as" to "Me"
- [ ] Set "Who has access" to "Only myself" (recommended for security)
- [ ] Deployed and copied webhook URL

### Step 5: Update Code
- [ ] Opened `src/pages/Index.tsx`
- [ ] Found webhook URL line (around line 70)
- [ ] Replaced placeholder with actual webhook URL

### Step 6: Test
- [ ] Started dev server with `npm run dev`
- [ ] Opened site at localhost:8080
- [ ] Filled out test form
- [ ] Submitted form
- [ ] Checked Google Sheet for new entry

## 🎉 Success Indicators

When everything is working, you should see:
- ✅ Form submission shows success message
- ✅ Google Sheet has new row with your test data
- ✅ No errors in browser console (F12)
- ✅ Data appears with timestamp, name, email, and city

## 🆘 If Something's Not Working

1. **Check browser console** (F12) for error messages
2. **Verify webhook URL** is correct and accessible
3. **Ensure Apps Script** is deployed as web app
4. **Check permissions** - script needs access to Google Sheets
5. **Test webhook URL** by visiting it in browser (should show status message)

## 📞 Quick Help

- **Webhook URL format**: `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec`
- **Common error**: "Webhook URL not configured" - means you need to add your URL
- **Permission issues**: Re-authorize the Apps Script when prompted
- **CORS errors**: Make sure "Who has access" is set to "Anyone"
