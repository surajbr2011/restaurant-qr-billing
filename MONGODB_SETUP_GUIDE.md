# MongoDB Installation Guide for Windows

## Option 1: Install MongoDB Community Server (Recommended)

### Step 1: Download MongoDB
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest (7.0 or higher)
   - Platform: Windows
   - Package: MSI
3. Click "Download"

### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose "Complete" installation
3. **IMPORTANT:** Check "Install MongoDB as a Service"
4. **IMPORTANT:** Check "Install MongoDB Compass" (GUI tool)
5. Click "Install"

### Step 3: Verify Installation
Open PowerShell and run:
```powershell
# Check if MongoDB service is running
Get-Service -Name MongoDB

# Or try to connect
mongo --version
# OR
mongosh --version
```

### Step 4: Start MongoDB Service (if not running)
```powershell
# Start MongoDB service
net start MongoDB

# Or using Services
# Press Win+R, type "services.msc", find "MongoDB", and start it
```

---

## Option 2: Use MongoDB Atlas (Cloud - FREE)

If you don't want to install MongoDB locally, use MongoDB Atlas (cloud database):

### Step 1: Create Free Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up for free
3. Create a free cluster (M0 - Free tier)

### Step 2: Get Connection String
1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db
   ```

### Step 3: Update .env File
Edit `backend/.env`:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
```

Replace `username` and `password` with your MongoDB Atlas credentials.

---

## Option 3: Quick Fix - Use MongoDB in Docker

If you have Docker installed:

```powershell
# Pull and run MongoDB
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Check if running
docker ps
```

---

## After MongoDB is Running

### Test Connection
```powershell
cd backend
node -e "const mongoose = require('mongoose'); mongoose.connect('mongodb://localhost:27017/restaurant_db').then(() => console.log('✅ Connected!')).catch(err => console.log('❌ Error:', err))"
```

### Generate QR Codes
```powershell
node scripts/generateQRCodes.js
```

---

## Troubleshooting

### Issue: "mongod not recognized"
**Solution:** MongoDB is not installed or not in PATH. Use Option 1 or 2 above.

### Issue: "Connection timeout"
**Solution:** MongoDB service is not running. Start it:
```powershell
net start MongoDB
```

### Issue: "Authentication failed"
**Solution:** If using MongoDB Atlas, check username/password in connection string.

---

## Quick Recommendation

**For Development:** Use MongoDB Atlas (Option 2) - No installation needed!
**For Production:** Install MongoDB Community Server (Option 1)

Choose the option that works best for you!
