# 🚀 Quick Google Apps Script Setup

## The "No Functions" Problem - SOLVED! ✅

### Step 1: Open Google Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click "New Project"

### Step 2: Delete Default Code
- You'll see this default code:
```javascript
function myFunction() {
  
}
```
- **DELETE ALL OF IT** - select everything and press Delete

### Step 3: Copy the Complete Code
1. Open your project folder
2. Find the file `google-apps-script.js`
3. **Select ALL** the contents (Ctrl+A or Cmd+A)
4. **Copy** everything (Ctrl+C or Cmd+C)

### Step 4: Paste the Code
1. Go back to Google Apps Script
2. **Paste** the entire code (Ctrl+V or Cmd+V)
3. You should see 4 functions:
   - `doPost(e)`
   - `doGet(e)`
   - `doOptions(e)`
   - `setupSheet()`

### Step 5: Save
1. Click "Save" (or Ctrl+S)
2. Name it "Action Pact Form Handler"

### Step 6: Deploy as Web App
1. **Click "Deploy"** (top right)
2. **Click "New deployment"**
3. **Configure settings**:
   - **Type**: "Web app"
   - **Execute as**: "Me"
   - **Who has access**: "Only myself" (recommended for security)
   - **Description**: "Action Pact Form Handler v1"
4. **Click "Deploy"**
5. **Authorize** when prompted
6. **Copy the webhook URL** (looks like: `https://script.google.com/macros/s/AKfycbz.../exec`)

### 🔒 Security Note
**"Only myself"** is the most secure option - only you can access the webhook, which is perfect for your personal project!

## ✅ Success Indicators

You know it's working when:
- You see 4 functions in the dropdown
- `setupSheet` function runs without errors
- Your Google Sheet shows headers: Timestamp, Name, Email, City

## 🆘 Still Having Issues?

**Problem**: "No functions" error
**Solution**: You didn't copy the complete code. Make sure you copied **everything** from `google-apps-script.js`

**Problem**: Can't see `setupSheet` in dropdown
**Solution**: Refresh the page and check that the code was saved properly

**Problem**: Permission denied
**Solution**: Click "Review Permissions" and "Allow" when prompted
