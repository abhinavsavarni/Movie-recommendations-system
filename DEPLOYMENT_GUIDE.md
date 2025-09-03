# Movie Recommendation System - Deployment Guide

This guide will help you connect your frontend deployed on Vercel with your backend deployed on Render.

## 🚀 Quick Setup

### 1. Frontend (Vercel) Configuration

1. **Go to your Vercel dashboard**
2. **Select your project**
3. **Go to Settings → Environment Variables**
4. **Add this environment variable:**
   ```
   Name: REACT_APP_BACKEND_URL
   Value: https://movie-recommendations-system-54fn.onrender.com
   Environment: Production
   ```
5. **Redeploy your frontend**

### 2. Backend (Render) Configuration

1. **Go to your Render dashboard**
2. **Select your backend service**
3. **Go to Environment → Environment Variables**
4. **Add these required variables:**
   ```
   MONGODB_URI=your_mongodb_connection_string
   DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
   TMDB_API_KEY=your_tmdb_api_key
   ```
5. **Add this optional variable:**
   ```
   FRONTEND_URL=https://movie-recommendations-system-taupe.vercel.app
   ```
6. **Redeploy your backend**

## 🔧 What We've Updated

### Frontend Changes:
- ✅ Created `frontend/src/config/api.js` for centralized API configuration
- ✅ Updated `Chatbot.js` to use the configured backend URL
- ✅ Added automatic environment detection (dev vs production)

### Backend Changes:
- ✅ Updated CORS configuration to allow Vercel domains
- ✅ Added health check endpoint at `/health`
- ✅ Improved security with specific origin allowlist

## 🧪 Testing the Connection

### 1. Test Backend Health:
```
GET https://movie-recommendations-system-54fn.onrender.com/health
```
Expected response: `{"status":"OK","timestamp":"..."}`

### 2. Test Chatbot:
1. Open your deployed frontend
2. Click the chat icon
3. Send a message like "Recommend me an action movie"
4. Check browser console for any errors

### 3. Check Network Tab:
- Open browser DevTools → Network tab
- Send a chat message
- Verify the request goes to your Render backend URL

## 🚨 Common Issues & Solutions

### Issue: CORS Error
**Solution:** Ensure your frontend URL is in the backend's allowed origins

### Issue: 404 Error
**Solution:** Verify the backend URL is correct and the service is running

### Issue: Backend Sleeping (Free Tier)
**Solution:** First request after 15+ minutes of inactivity may take 30-60 seconds

### Issue: Environment Variables Not Working
**Solution:** Redeploy both frontend and backend after setting variables

## 📁 File Structure After Updates

```
Movie-Recommendation-System-master/
├── frontend/
│   ├── src/
│   │   ├── config/
│   │   │   └── api.js          ← NEW: API configuration
│   │   ├── components/
│   │   │   └── Chatbot/
│   │   │       └── Chatbot.js  ← UPDATED: Uses config
│   │   └── ...
│   └── DEPLOYMENT.md           ← NEW: Frontend deployment guide
├── backend/
│   ├── src/
│   │   └── index.ts            ← UPDATED: CORS + health endpoint
│   └── DEPLOYMENT.md           ← NEW: Backend deployment guide
└── DEPLOYMENT_GUIDE.md         ← NEW: This comprehensive guide
```

## 🔍 Debugging Steps

1. **Check Backend Logs** in Render dashboard
2. **Check Frontend Console** for JavaScript errors
3. **Verify Environment Variables** are set correctly
4. **Test Backend Endpoints** directly (using Postman or curl)
5. **Check Network Requests** in browser DevTools

## 📞 Support

If you encounter issues:
1. Check the specific deployment guides in `frontend/DEPLOYMENT.md` and `backend/DEPLOYMENT.md`
2. Verify all environment variables are set correctly
3. Check that both services are running and accessible
4. Ensure your backend is not in sleep mode (Render free tier limitation)

## 🎯 Next Steps

After successful connection:
1. Test all chatbot functionality
2. Consider adding more backend endpoints for movie data
3. Implement error handling and loading states
4. Add monitoring and analytics
5. Consider upgrading Render plan for production use 