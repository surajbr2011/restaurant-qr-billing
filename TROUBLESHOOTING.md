# 🔍 TROUBLESHOOTING GUIDE - "It's Not Coming"

## 📱 Step-by-Step Diagnosis

### STEP 1: Test Basic Connection

**On your phone, open browser and go to:**
```
http://192.168.1.6:3001/debug.html
```

This will show you:
- ✅ If you can connect to the server
- ✅ If backend API is reachable
- ✅ If QR token validation works
- ✅ Any JavaScript errors

**What to look for:**
- Green ✅ = Working
- Red ❌ = Problem found

---

### STEP 2: Check What "Not Coming" Means

Please tell me which of these you're experiencing:

**A. Can't access the website at all**
- Browser shows "Can't reach this site"
- Connection timeout
- → Go to Section A below

**B. Website loads but shows blank/white screen**
- Page loads but nothing appears
- → Go to Section B below

**C. Website loads but shows error message**
- Page loads with error text
- → Go to Section C below

**D. Login screen doesn't appear after scanning QR**
- QR scans but nothing happens
- → Go to Section D below

---

## SECTION A: Can't Access Website

### Check 1: Same WiFi Network
```powershell
# On your computer, check WiFi name
netsh wlan show interfaces | Select-String "SSID"
```

**On your phone:**
- Settings → WiFi → Check network name
- Must match computer's WiFi

### Check 2: Verify IP Address
```powershell
# On computer
ipconfig | Select-String "IPv4"
```

Should show: `192.168.1.6`

If different, update `.env` file and regenerate QR codes.

### Check 3: Test from Computer First
```
http://192.168.1.6:3001
```

If this works on computer but not phone → Firewall issue

### Check 4: Windows Firewall
```powershell
# Allow Python through firewall (Run as Administrator)
New-NetFirewallRule -DisplayName "Python HTTP Server" -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3001
```

Or manually:
1. Windows Security → Firewall
2. Allow an app
3. Find Python
4. Check Private and Public
5. OK

---

## SECTION B: Blank/White Screen

### Check 1: Browser Console
**On phone (if possible):**
- Chrome: Menu → More tools → Developer tools
- Safari: Settings → Advanced → Web Inspector

**Or test on computer:**
```
http://192.168.1.6:3001?token=PASTE_TOKEN_HERE
```

### Check 2: JavaScript Errors
Open debug page:
```
http://192.168.1.6:3001/debug.html
```

Look for errors in "JavaScript Console" section

### Check 3: Files Loading
Check Python server terminal for 404 errors:
```
192.168.1.x - - [date] "GET /script.js HTTP/1.1" 404
```

If you see 404s, files are missing or in wrong location.

---

## SECTION C: Error Message Shown

### Common Errors:

**"Invalid token"**
- QR codes need regeneration
- Encryption key mismatch
- Solution: Run `node scripts/generateQRCodes.js`

**"Failed to connect"**
- Backend not running
- Wrong IP address
- Solution: Check backend is on port 5001

**"Site can't be reached"**
- Network issue
- Firewall blocking
- Solution: See Section A

---

## SECTION D: QR Scans But Nothing Happens

### Check 1: What URL Opens?
When you scan QR, what URL appears in browser?

**Should be:**
```
http://192.168.1.6:3001?token=LONG_ENCRYPTED_STRING
```

**If it shows:**
```
http://localhost:3001?token=...
```
→ QR codes not regenerated with IP address

**Solution:**
```powershell
cd backend
node scripts/generateQRCodes.js
node scripts/downloadQRCodes.js
```

### Check 2: Token in URL
Look at the URL - is there `?token=` part?

**If NO token:**
- QR code is corrupted
- Regenerate QR codes

**If token exists:**
- Test validation at: `http://192.168.1.6:3001/debug.html?token=PASTE_TOKEN`

---

## 🧪 DIAGNOSTIC TESTS

### Test 1: Can you ping the computer?
**On phone (if you have terminal app):**
```
ping 192.168.1.6
```

Should get replies. If not → network issue.

### Test 2: Backend Health Check
**On phone browser:**
```
http://192.168.1.6:5001/api/health
```

Should show:
```json
{"status":"Server is running","timestamp":"..."}
```

### Test 3: Customer Frontend
**On phone browser:**
```
http://192.168.1.6:3001
```

Should show SOMETHING (even if error page).

### Test 4: Debug Page
**On phone browser:**
```
http://192.168.1.6:3001/debug.html
```

Should show diagnostic information.

---

## 🔧 QUICK FIXES

### Fix 1: Restart Everything
```powershell
# Stop all servers (Ctrl+C in each terminal)

# Restart backend
cd backend
npm run dev

# Restart customer frontend
cd customer-frontend
python -m http.server 3001 --bind 0.0.0.0

# Regenerate QR codes
cd backend
node scripts/generateQRCodes.js
node scripts/downloadQRCodes.js
```

### Fix 2: Check Environment Variables
```powershell
# View .env file
cat backend/.env
```

Should have:
```
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/restaurant_db
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=bdd37e05a2ca7ce07e95a32a16345501f
CUSTOMER_FRONTEND_URL=http://192.168.1.6:3001
NODE_ENV=development
```

### Fix 3: Verify Services Running
```powershell
# Check if ports are listening
netstat -an | Select-String "3001|5001"
```

Should show:
```
TCP    0.0.0.0:3001    LISTENING
TCP    0.0.0.0:5001    LISTENING
```

---

## 📊 CHECKLIST

Before asking for more help, verify:

- [ ] Computer and phone on same WiFi
- [ ] Backend running (`npm run dev` in backend folder)
- [ ] Customer frontend running (`python -m http.server 3001 --bind 0.0.0.0`)
- [ ] Can access `http://192.168.1.6:3001` from phone
- [ ] Can access `http://192.168.1.6:5001/api/health` from phone
- [ ] QR codes regenerated with IP address
- [ ] No firewall blocking connections
- [ ] IP address is correct (192.168.1.6)

---

## 🆘 STILL NOT WORKING?

Please provide:

1. **What exactly happens when you scan QR code?**
   - Does browser open?
   - What URL shows?
   - What do you see on screen?

2. **Test results from debug page:**
   - Open `http://192.168.1.6:3001/debug.html` on phone
   - Screenshot or describe what you see

3. **Can you access from computer?**
   - Try `http://192.168.1.6:3001` on computer browser
   - Does it work?

4. **Python server logs:**
   - What do you see in the terminal running Python server?
   - Any 404 errors?
   - Any requests showing?

---

**Next Step:** Open `http://192.168.1.6:3001/debug.html` on your phone and tell me what you see!
