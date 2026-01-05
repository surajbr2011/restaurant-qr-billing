# 🚀 Deployment Checklist

Use this checklist to ensure a smooth deployment process.

---

## Pre-Deployment

### Code Preparation
- [ ] All features tested locally
- [ ] MongoDB connection working
- [ ] QR codes generated successfully
- [ ] No console errors in browser
- [ ] All API endpoints working
- [ ] Socket.io connections stable

### Security
- [ ] Generated strong JWT_SECRET (32+ characters)
- [ ] Generated strong ENCRYPTION_KEY (32 characters)
- [ ] Removed all hardcoded secrets from code
- [ ] Updated `.gitignore` to exclude `.env` files
- [ ] Reviewed CORS configuration

### Configuration
- [ ] Created `.env.production` file
- [ ] Updated API URLs in customer frontend
- [ ] Updated API URLs in admin frontend
- [ ] Configured MongoDB Atlas connection string

---

## Backend Deployment

### Platform Selection
- [ ] Chosen deployment platform:
  - [ ] Render.com (Free, recommended)
  - [ ] Railway.app (Free)
  - [ ] Heroku (Free with limitations)
  - [ ] VPS (DigitalOcean, AWS, etc.)

### Deployment Steps
- [ ] Created account on chosen platform
- [ ] Connected GitHub repository (if applicable)
- [ ] Configured build command: `cd backend && npm install`
- [ ] Configured start command: `cd backend && npm start`
- [ ] Set environment variables:
  - [ ] NODE_ENV=production
  - [ ] PORT=5000
  - [ ] MONGODB_URI
  - [ ] JWT_SECRET
  - [ ] ENCRYPTION_KEY
  - [ ] CUSTOMER_FRONTEND_URL
  - [ ] ADMIN_FRONTEND_URL
- [ ] Deployed successfully
- [ ] Backend URL: ________________

### Post-Deployment Testing
- [ ] Health check endpoint working: `/api/health`
- [ ] Can fetch menu items: `/api/menu`
- [ ] QR validation working: `/api/qrcode/validate`
- [ ] No errors in deployment logs

---

## Database Setup

### MongoDB Atlas
- [ ] Created MongoDB Atlas account
- [ ] Created free cluster (M0)
- [ ] Created database user with strong password
- [ ] Configured network access (0.0.0.0/0 or specific IPs)
- [ ] Got connection string
- [ ] Updated MONGODB_URI in backend environment variables
- [ ] Connection string: ________________

### Data Migration
- [ ] Exported local data (if needed)
- [ ] Imported data to MongoDB Atlas
- [ ] Generated QR codes on production database
- [ ] Verified all data migrated correctly

---

## Frontend Deployment

### Customer Frontend
- [ ] Chosen deployment platform:
  - [ ] Netlify (recommended)
  - [ ] Vercel
  - [ ] GitHub Pages
  - [ ] Cloudflare Pages

- [ ] Updated API URLs in `script.js`:
  ```javascript
  API_URL: 'https://your-backend-url.onrender.com'
  SOCKET_URL: 'https://your-backend-url.onrender.com'
  ```

- [ ] Deployed successfully
- [ ] Customer Frontend URL: ________________

- [ ] Tested:
  - [ ] QR code scanning works
  - [ ] Login screen appears
  - [ ] Menu loads correctly
  - [ ] Can place orders
  - [ ] Socket.io connects

### Admin Frontend
- [ ] Created `.env.production`:
  ```
  VITE_API_URL=https://your-backend-url.onrender.com
  ```

- [ ] Built production bundle: `npm run build`

- [ ] Deployed to:
  - [ ] Vercel (recommended)
  - [ ] Netlify
  - [ ] Other: ________________

- [ ] Admin Frontend URL: ________________

- [ ] Tested:
  - [ ] Can login
  - [ ] Can view orders
  - [ ] Can manage menu
  - [ ] Real-time updates working

---

## Domain & SSL (Optional)

### Domain Setup
- [ ] Purchased domain name
- [ ] Domain: ________________
- [ ] Configured DNS records:
  - [ ] A record for root domain
  - [ ] CNAME for www
  - [ ] CNAME for api subdomain
  - [ ] CNAME for admin subdomain

### SSL Certificate
- [ ] SSL enabled (automatic on Netlify/Vercel/Render)
- [ ] HTTPS working for all URLs
- [ ] No mixed content warnings

---

## Production QR Codes

### Generation
- [ ] Connected to production backend
- [ ] Ran: `node scripts/generateQRCodes.js`
- [ ] Verified QR codes in database
- [ ] QR codes point to production customer frontend URL

### Download & Print
- [ ] Ran: `node scripts/downloadQRCodes.js`
- [ ] Downloaded all QR code images
- [ ] Printed QR codes (recommended: 10cm x 10cm)
- [ ] Laminated for durability
- [ ] Placed on tables with table numbers visible

---

## Testing

### End-to-End Testing
- [ ] Scanned QR code with phone
- [ ] Login screen appeared correctly
- [ ] Entered customer details
- [ ] Session created successfully
- [ ] Menu loaded
- [ ] Added items to cart
- [ ] Placed order
- [ ] Order appeared in admin dashboard
- [ ] Real-time updates working
- [ ] Bill generation working

### Cross-Browser Testing
- [ ] Chrome (Desktop & Mobile)
- [ ] Safari (Desktop & Mobile)
- [ ] Firefox
- [ ] Edge

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No memory leaks
- [ ] Works on slow 3G connection

---

## Security Verification

- [ ] HTTPS enabled on all domains
- [ ] CORS configured correctly
- [ ] No sensitive data in client-side code
- [ ] Environment variables not exposed
- [ ] Rate limiting enabled (if applicable)
- [ ] Input validation working
- [ ] SQL injection protection (MongoDB)
- [ ] XSS protection enabled

---

## Monitoring & Logging

### Setup Monitoring
- [ ] Configured error logging
- [ ] Set up uptime monitoring:
  - [ ] UptimeRobot (free)
  - [ ] Pingdom
  - [ ] Other: ________________

- [ ] Configured alerts for:
  - [ ] Server downtime
  - [ ] High error rates
  - [ ] Database connection issues

### Log Access
- [ ] Know how to access backend logs
- [ ] Know how to access database logs
- [ ] Set up log retention policy

---

## Documentation

- [ ] Updated README with deployment info
- [ ] Documented environment variables
- [ ] Created runbook for common issues
- [ ] Documented backup procedures
- [ ] Created staff training materials

---

## Backup & Recovery

- [ ] Configured automated database backups
- [ ] Tested backup restoration
- [ ] Documented recovery procedures
- [ ] Stored backup credentials securely

---

## Staff Training

- [ ] Trained staff on:
  - [ ] How customers use QR codes
  - [ ] How to use admin dashboard
  - [ ] How to handle common issues
  - [ ] Who to contact for technical issues

- [ ] Created quick reference guide
- [ ] Conducted test run with staff

---

## Launch Preparation

### Soft Launch
- [ ] Tested with limited tables (1-2 tables)
- [ ] Monitored for 24 hours
- [ ] Fixed any issues found
- [ ] Collected initial feedback

### Full Launch
- [ ] Deployed QR codes to all tables
- [ ] Announced to customers
- [ ] Staff ready to assist customers
- [ ] Monitoring dashboard open

---

## Post-Launch

### First 24 Hours
- [ ] Monitor error logs continuously
- [ ] Check database performance
- [ ] Verify all orders processing correctly
- [ ] Respond to customer feedback

### First Week
- [ ] Daily log review
- [ ] Performance optimization
- [ ] Fix any bugs discovered
- [ ] Collect usage statistics

### First Month
- [ ] Weekly performance review
- [ ] Analyze customer usage patterns
- [ ] Plan feature improvements
- [ ] Review costs and optimize

---

## Maintenance Schedule

### Daily
- [ ] Check error logs
- [ ] Monitor active sessions
- [ ] Verify order processing

### Weekly
- [ ] Review QR code usage statistics
- [ ] Check database size and performance
- [ ] Update menu items if needed
- [ ] Backup database

### Monthly
- [ ] Update dependencies
- [ ] Security audit
- [ ] Performance optimization
- [ ] Review and optimize costs
- [ ] Plan new features

---

## Emergency Contacts

- **Technical Support:** ________________
- **Hosting Provider:** ________________
- **Database Provider:** ________________
- **Domain Registrar:** ________________

---

## Rollback Plan

### If Deployment Fails
1. [ ] Revert to previous version
2. [ ] Check error logs for root cause
3. [ ] Fix issues in development
4. [ ] Test thoroughly
5. [ ] Redeploy

### Emergency Procedures
- [ ] Documented how to quickly disable QR system
- [ ] Fallback to manual ordering process
- [ ] Customer communication plan

---

## Success Criteria

- [ ] Zero downtime during deployment
- [ ] All features working in production
- [ ] Page load time < 3 seconds
- [ ] 99.9% uptime in first week
- [ ] Positive customer feedback
- [ ] Staff comfortable using system

---

## Sign-Off

**Deployment Date:** ________________

**Deployed By:** ________________

**Verified By:** ________________

**Status:** 
- [ ] ✅ Deployment Successful
- [ ] ⚠️ Deployment with Minor Issues
- [ ] ❌ Deployment Failed

**Notes:**
_____________________________________________
_____________________________________________
_____________________________________________

---

**🎉 Congratulations on your deployment!**

Keep this checklist for future reference and updates.
