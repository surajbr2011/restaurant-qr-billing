# 📱 Mobile Access Setup Guide

## ❌ Problem: "Site Can't Be Reached" When Scanning QR Code

When you scan the QR code with your phone, it tries to access `localhost:3001`, but `localhost` on your phone refers to the phone itself, not your computer.

---

## ✅ Solution: Use Your Computer's IP Address

### Your Computer's IP Address:
```
192.168.1.6
```

---

## 🔧 Steps to Fix

### Step 1: Update Backend Environment

✅ **Already Done!** I've added this to your `.env` file:
```env
CUSTOMER_FRONTEND_URL=http://192.168.1.6:3001
```

### Step 2: Regenerate QR Codes

The QR codes need to be regenerated with the new IP address:

```powershell
cd backend
node scripts/generateQRCodes.js
```

This will create QR codes that point to `http://192.168.1.6:3001` instead of `localhost:3001`.

### Step 3: Download New QR Codes

```powershell
node scripts/downloadQRCodes.js
```

### Step 4: Allow Firewall Access

Windows Firewall might block incoming connections. Allow Python:

```powershell
# Run as Administrator
New-NetFirewallRule -DisplayName "Python HTTP Server" -Direction Inbound -Program "C:\Python\python.exe" -Action Allow
```

Or manually:
1. Windows Security → Firewall & network protection
2. Allow an app through firewall
3. Find Python
4. Check both Private and Public
5. Click OK

---

## 🧪 Test Mobile Access

### From Your Phone:

1. **Make sure phone is on same WiFi** as your computer
2. **Open browser on phone**
3. **Type this URL:**
   ```
   http://192.168.1.6:3001
   ```
4. **You should see** the customer frontend homepage

### If It Works:

✅ Scan the new QR code
✅ Should open the login screen
✅ Complete flow should work

---

## 🔄 Alternative: Restart Customer Frontend

The Python server might need to bind to all interfaces:

### Stop Current Server:
- Go to terminal running `python -m http.server 3001`
- Press `Ctrl+C`

### Start with IP Binding:
```powershell
cd customer-frontend
python -m http.server 3001 --bind 0.0.0.0
```

This allows connections from any device on your network.

---

## 📋 Complete Setup Commands

Run these in order:

```powershell
# 1. Stop customer frontend (Ctrl+C in that terminal)

# 2. Restart with network binding
cd "c:\Users\SURAJ\Desktop\restaurants billing software\restaurant-qr-billing\customer-frontend"
python -m http.server 3001 --bind 0.0.0.0

# 3. In a NEW terminal, regenerate QR codes
cd "c:\Users\SURAJ\Desktop\restaurants billing software\restaurant-qr-billing\backend"
node scripts/generateQRCodes.js

# 4. Download new QR codes
node scripts/downloadQRCodes.js

# 5. Test from phone browser
# Open: http://192.168.1.6:3001
```

---

## 🧪 Quick Test

### Test Backend from Phone:
```
http://192.168.1.6:5001/api/health
```

Should show: `{"status":"Server is running",...}`

### Test Customer Frontend from Phone:
```
http://192.168.1.6:3001
```

Should show the customer frontend page.

---

## 🔍 Troubleshooting

### Still Can't Connect?

**Check 1: Same WiFi Network**
- Computer and phone must be on same WiFi
- Not mobile data, not guest WiFi

**Check 2: Firewall**
- Windows Firewall might be blocking
- Temporarily disable to test
- Or add firewall rules (see Step 4 above)

**Check 3: IP Address**
- IP might change if router restarts
- Run `ipconfig` again to verify
- Update if changed

**Check 4: Port Availability**
- Make sure ports 3001 and 5001 are not blocked
- No other apps using these ports

---

## 📱 For Production Deployment

When you deploy to a real server:
- Use a proper domain name (e.g., `myrestaurant.com`)
- Enable HTTPS
- QR codes will work from anywhere
- No IP address or WiFi issues

---

## 🎯 Next Steps

1. **Stop customer frontend** (Ctrl+C)
2. **Restart with network binding** (`python -m http.server 3001 --bind 0.0.0.0`)
3. **Regenerate QR codes** (`node scripts/generateQRCodes.js`)
4. **Download QR codes** (`node scripts/downloadQRCodes.js`)
5. **Test from phone** (http://192.168.1.6:3001)
6. **Scan new QR code**

---

**Your Computer IP:** `192.168.1.6`
**Customer Frontend:** `http://192.168.1.6:3001`
**Backend API:** `http://192.168.1.6:5001`
