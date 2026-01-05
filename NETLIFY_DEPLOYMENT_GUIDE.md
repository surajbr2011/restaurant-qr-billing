# 🚀 Deployment Guide: Netlify + Render

Your project is split into three parts. Netlify is excellent for the **Frontends**, but for the **Backend** (Database & API), you should use **Render** (or Railway/Heroku) because Netlify is for static sites.

---

## 🏗️ Phase 1: Deploy Backend (Render)

**You must deploy the backend first** so you have the API URL to give to the frontends.

1.  **Push your code to GitHub** (if you haven't already).
2.  Go to [dashboard.render.com](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  Select the `backend` folder as the **Root Directory**.
6.  **Settings**:
    *   **Build Command**: `npm install`
    *   **Start Command**: `npm start`
7.  **Environment Variables** (Add these in Render):
    *   `MONGODB_URI`: (Your MongoDB Atlas connection string)
    *   `JWT_SECRET`: (Random string)
    *   `ENCRYPTION_KEY`: (32-char random string)
    *   `CORS_ORIGIN`: `*` (Initially `*` is easier for testing, or list your Netlify URLs later)
8.  **Deploy**.
9.  **Copy your Backend URL** (e.g., `https://my-backend.onrender.com`).

---

## 🎨 Phase 2: Deploy Admin Frontend (Netlify)

1.  Go to [app.netlify.com](https://app.netlify.com).
2.  **Add new site** -> **Import from existing project**.
3.  Connect GitHub -> Choose your repo.
4.  **Configuration**:
    *   **Base directory**: `admin-frontend`
    *   **Build command**: `npm run build`
    *   **Publish directory**: `admin-frontend/dist`
5.  **Environment Variables** (Click "Show advanced" or go to Site Settings later):
    *   Key: `VITE_API_URL`
    *   Value: `https://my-backend.onrender.com/api` (The URL from Phase 1)
6.  **Deploy Site**.

---

## 📱 Phase 3: Deploy Customer Frontend (Netlify)

1.  Go to [app.netlify.com](https://app.netlify.com).
2.  **Add new site** -> **Import from existing project**.
3.  Connect GitHub -> Choose your repo.
4.  **Configuration**:
    *   **Base directory**: `customer-frontend`
    *   **Build command**: (Leave empty)
    *   **Publish directory**: `customer-frontend` (or just `.`)
5.  **Deploy Site**.
6.  **Post-Deployment Configuration**:
    *   Since this is a plain HTML site, environment variables won't work automatically during build.
    *   **Option A (Simplest)**: After deployment, go to your GitHub code, edit `customer-frontend/config.js`, change the URL to your Render backend, and push. Netlify will auto-update.
    *   **Option B (Advanced)**: Use a Netlify Snippet to inject the config.

---

## ✅ Final Verification

1.  **Open Admin Site**: Try logging in.
2.  **Open Customer Site**:
    *   You will need to generate **NEW QR CODES** because the URL for the customer site has changed!
    *   Run the script locally or update the `CUSTOMER_FRONTEND_URL` in your Backend Render settings and restart it.
    *   Then, use the Admin panel to "Regenerate QR" for tables.

**Happy Deploying! 🚀**
