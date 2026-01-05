# 🚀 Deployment Guide - Restaurant QR Billing System

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Domain & SSL](#domain--ssl)
7. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### ✅ Before You Deploy

- [ ] All code tested locally
- [ ] MongoDB connection working
- [ ] QR codes generated
- [ ] Environment variables configured
- [ ] Security keys generated
- [ ] Domain name purchased (optional)
- [ ] Hosting platform selected

---

## Environment Configuration

### Production Environment Variables

Create `.env.production` in backend:

```env
# Server Configuration
NODE_ENV=production
PORT=5000

# Database (MongoDB Atlas - Recommended)
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority

# Security Keys (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-min-32-characters-long
ENCRYPTION_KEY=your-32-character-encryption-key!!

# Frontend URLs
CUSTOMER_FRONTEND_URL=https://yourdomain.com
ADMIN_FRONTEND_URL=https://admin.yourdomain.com

# CORS Origins
CORS_ORIGIN=https://yourdomain.com,https://admin.yourdomain.com

# Optional: Email/SMS for notifications
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Generate Secure Keys

```bash
# Generate JWT Secret (32+ characters)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate Encryption Key (32 characters)
node -e "console.log(require('crypto').randomBytes(16).toString('hex'))"
```

---

## Backend Deployment

### Option 1: Deploy to Render.com (FREE - Recommended)

#### Step 1: Prepare Backend

Create `render.yaml` in project root:

```yaml
services:
  - type: web
    name: restaurant-qr-backend
    env: node
    region: oregon
    plan: free
    buildCommand: cd backend && npm install
    startCommand: cd backend && npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: ENCRYPTION_KEY
        generateValue: true
      - key: CUSTOMER_FRONTEND_URL
        sync: false
      - key: PORT
        value: 5000
```

#### Step 2: Update package.json

Add to `backend/package.json`:

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Step 3: Deploy

1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name:** restaurant-qr-backend
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
6. Add environment variables from `.env.production`
7. Click "Create Web Service"

**Your backend URL:** `https://restaurant-qr-backend.onrender.com`

---

### Option 2: Deploy to Railway.app (FREE)

#### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

#### Step 2: Deploy

```bash
cd backend
railway login
railway init
railway up
```

#### Step 3: Add Environment Variables

```bash
railway variables set MONGODB_URI="your-mongodb-uri"
railway variables set JWT_SECRET="your-jwt-secret"
railway variables set ENCRYPTION_KEY="your-encryption-key"
```

---

### Option 3: Deploy to Heroku

#### Step 1: Install Heroku CLI

Download from: https://devcenter.heroku.com/articles/heroku-cli

#### Step 2: Create Procfile

Create `Procfile` in backend directory:

```
web: node server.js
```

#### Step 3: Deploy

```bash
cd backend
heroku login
heroku create restaurant-qr-backend
git init
git add .
git commit -m "Initial deployment"
git push heroku main

# Set environment variables
heroku config:set MONGODB_URI="your-mongodb-uri"
heroku config:set JWT_SECRET="your-jwt-secret"
heroku config:set ENCRYPTION_KEY="your-encryption-key"
```

---

### Option 4: Deploy to VPS (DigitalOcean, AWS, etc.)

#### Step 1: Server Setup

```bash
# SSH into your server
ssh root@your-server-ip

# Update system
apt update && apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# Install PM2 (Process Manager)
npm install -g pm2

# Install Nginx (Reverse Proxy)
apt install -y nginx
```

#### Step 2: Upload Code

```bash
# On your local machine
scp -r backend root@your-server-ip:/var/www/restaurant-qr-backend
```

#### Step 3: Configure PM2

```bash
# On server
cd /var/www/restaurant-qr-backend
npm install --production

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'restaurant-backend',
    script: 'server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    }
  }]
}
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Step 4: Configure Nginx

```bash
cat > /etc/nginx/sites-available/restaurant-backend << 'EOF'
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

ln -s /etc/nginx/sites-available/restaurant-backend /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

---

## Frontend Deployment

### Customer Frontend

#### Option 1: Deploy to Netlify (FREE - Recommended)

1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login
3. Drag & drop `customer-frontend` folder
4. Configure:
   - **Site name:** restaurant-customer
   - **Build command:** (leave empty)
   - **Publish directory:** `.`

**Update API URLs in `customer-frontend/script.js`:**

```javascript
// Replace localhost URLs with your deployed backend URL
const API_URL = 'https://restaurant-qr-backend.onrender.com';

// Update all fetch calls
fetch(`${API_URL}/api/qrcode/validate`, ...)
fetch(`${API_URL}/api/customer/login`, ...)
```

#### Option 2: Deploy to Vercel

```bash
cd customer-frontend
npm install -g vercel
vercel
```

#### Option 3: Deploy to GitHub Pages

```bash
# Push to GitHub
git init
git add .
git commit -m "Deploy customer frontend"
git branch -M main
git remote add origin https://github.com/yourusername/restaurant-customer.git
git push -u origin main

# Enable GitHub Pages in repository settings
# Settings → Pages → Source: main branch
```

---

### Admin Frontend (React)

#### Option 1: Deploy to Vercel (Recommended)

```bash
cd admin-frontend

# Update .env.production
echo "VITE_API_URL=https://restaurant-qr-backend.onrender.com" > .env.production

# Build
npm run build

# Deploy
npm install -g vercel
vercel --prod
```

#### Option 2: Deploy to Netlify

```bash
cd admin-frontend
npm run build

# Upload dist folder to Netlify
# Or use Netlify CLI:
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

---

## Database Setup

### MongoDB Atlas (Recommended for Production)

#### Step 1: Create Cluster

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up for free
3. Create a new cluster (M0 - Free tier)
4. Choose region closest to your users

#### Step 2: Configure Access

1. **Database Access:**
   - Create database user
   - Username: `restaurant_admin`
   - Password: Generate strong password
   - Role: `Atlas admin`

2. **Network Access:**
   - Add IP: `0.0.0.0/0` (Allow from anywhere)
   - Or add your server's IP for better security

#### Step 3: Get Connection String

1. Click "Connect" on your cluster
2. Choose "Connect your application"
3. Copy connection string:
   ```
   mongodb+srv://restaurant_admin:<password>@cluster0.xxxxx.mongodb.net/restaurant_db?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password

#### Step 4: Migrate Data

```bash
# Export from local MongoDB
mongodump --db restaurant_db --out ./backup

# Import to MongoDB Atlas
mongorestore --uri "mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/restaurant_db" ./backup/restaurant_db
```

---

## Domain & SSL

### Configure Custom Domain

#### Step 1: Purchase Domain

- Namecheap, GoDaddy, Google Domains, etc.
- Example: `myrestaurant.com`

#### Step 2: Configure DNS

Add these DNS records:

```
Type    Name        Value
A       @           Your-Server-IP (for VPS)
CNAME   www         myrestaurant.com
CNAME   api         restaurant-qr-backend.onrender.com (for Render)
CNAME   admin       restaurant-admin.vercel.app (for Vercel)
```

#### Step 3: Enable SSL (Free with Let's Encrypt)

**For VPS:**

```bash
# Install Certbot
apt install -y certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d myrestaurant.com -d www.myrestaurant.com -d api.myrestaurant.com

# Auto-renewal
certbot renew --dry-run
```

**For Render/Vercel/Netlify:**
- SSL is automatic when you add custom domain

---

## Post-Deployment

### 1. Generate Production QR Codes

```bash
# SSH into your backend server or use Railway/Render console
cd backend
node scripts/generateQRCodes.js
```

### 2. Update QR Code URLs

The QR codes will now point to your production customer frontend:
```
https://myrestaurant.com?token=ENCRYPTED_TOKEN
```

### 3. Download & Print QR Codes

Create a script to download all QR codes:

```javascript
// backend/scripts/downloadQRCodes.js
const mongoose = require('mongoose');
const QRCode = require('../models/QRCode');
const fs = require('fs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const qrs = await QRCode.find();
  
  if (!fs.existsSync('./qr-codes')) {
    fs.mkdirSync('./qr-codes');
  }
  
  for (const qr of qrs) {
    const base64Data = qr.qrCodeUrl.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(`./qr-codes/${qr.tableId}.png`, base64Data, 'base64');
    console.log(`✅ Saved ${qr.tableId}.png`);
  }
  
  console.log('\n✅ All QR codes saved to ./qr-codes/');
  process.exit(0);
});
```

Run:
```bash
node scripts/downloadQRCodes.js
```

### 4. Test Production System

```bash
# Test backend health
curl https://api.myrestaurant.com/api/health

# Test QR validation
curl -X POST https://api.myrestaurant.com/api/qrcode/validate \
  -H "Content-Type: application/json" \
  -d '{"token":"YOUR_QR_TOKEN"}'

# Test customer frontend
# Open: https://myrestaurant.com?token=YOUR_QR_TOKEN
```

### 5. Monitor & Logs

**Render/Railway:**
- Check logs in dashboard

**VPS with PM2:**
```bash
pm2 logs
pm2 monit
```

**MongoDB Atlas:**
- Monitor in Atlas dashboard
- Set up alerts for high usage

---

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Strong ENCRYPTION_KEY (32 characters)
- [ ] MongoDB user has strong password
- [ ] Network access restricted (if possible)
- [ ] HTTPS enabled on all domains
- [ ] CORS configured correctly
- [ ] Environment variables not in code
- [ ] `.env` files in `.gitignore`
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints

---

## Deployment Costs

### Free Tier Options

| Service | Backend | Frontend | Database | Total |
|---------|---------|----------|----------|-------|
| Render + Netlify + Atlas | FREE | FREE | FREE | $0/month |
| Railway + Vercel + Atlas | FREE | FREE | FREE | $0/month |
| Heroku + GitHub Pages + Atlas | FREE* | FREE | FREE | $0/month |

*Heroku free tier has limitations

### Paid Options (Better Performance)

| Service | Cost | Features |
|---------|------|----------|
| DigitalOcean Droplet | $6/month | Full control, better performance |
| MongoDB Atlas M10 | $57/month | Dedicated cluster, backups |
| Custom Domain | $10-15/year | Professional branding |

---

## Recommended Deployment Stack

**For Small Restaurant (Free):**
- Backend: Render.com
- Customer Frontend: Netlify
- Admin Frontend: Vercel
- Database: MongoDB Atlas (M0 Free)
- **Total Cost:** $0/month

**For Growing Restaurant (Paid):**
- Backend: DigitalOcean Droplet ($6/month)
- Frontends: Netlify/Vercel (Free)
- Database: MongoDB Atlas M10 ($57/month)
- Domain: Namecheap ($12/year)
- **Total Cost:** ~$64/month

---

## Quick Deploy Commands

```bash
# 1. Deploy Backend to Render
# (Use web interface - easiest)

# 2. Deploy Customer Frontend to Netlify
cd customer-frontend
# Update API URLs in script.js first!
netlify deploy --prod

# 3. Deploy Admin Frontend to Vercel
cd admin-frontend
echo "VITE_API_URL=https://your-backend-url.com" > .env.production
npm run build
vercel --prod

# 4. Generate QR Codes on Production
# (Use Render console or Railway CLI)
node scripts/generateQRCodes.js
```

---

## Support & Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check active sessions

**Weekly:**
- Review QR code usage
- Check database size
- Backup database

**Monthly:**
- Update dependencies
- Review security
- Optimize performance

---

## Troubleshooting

### Common Issues

**CORS Errors:**
```javascript
// backend/server.js
app.use(cors({
  origin: [
    'https://myrestaurant.com',
    'https://admin.myrestaurant.com'
  ]
}));
```

**MongoDB Connection Timeout:**
- Check network access in Atlas
- Verify connection string
- Check server IP whitelist

**QR Codes Not Working:**
- Verify CUSTOMER_FRONTEND_URL in .env
- Regenerate QR codes with correct URL
- Check QR token encryption key matches

---

## Next Steps After Deployment

1. ✅ Test all features in production
2. ✅ Print and place QR codes on tables
3. ✅ Train staff on the system
4. ✅ Monitor first few orders
5. ✅ Collect customer feedback
6. ✅ Set up analytics (optional)

---

**Deployment Status:** Ready to Deploy! 🚀

Choose your preferred platform and follow the steps above. Good luck!
