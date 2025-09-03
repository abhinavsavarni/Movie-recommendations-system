# Frontend Deployment Configuration

This guide explains how to configure your frontend deployed on Vercel to connect with your backend deployed on Render.

## Environment Variables

You need to set the following environment variables in your Vercel deployment:

### 1. Backend URL
Set `REACT_APP_BACKEND_URL` to your Render backend URL:
```
REACT_APP_BACKEND_URL=https://movie-recommendations-system-54fn.onrender.com
```

**How to set in Vercel:**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add:
   - Name: `REACT_APP_BACKEND_URL`
   - Value: `https://your-app-name.onrender.com`
   - Environment: Production (and Preview if you want)

### 2. Optional: TMDB API Key
If you want to use your own TMDB API key:
```
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

## Current Configuration

The frontend is configured to:
- Use `http://localhost:5000` for development
- Use the `REACT_APP_BACKEND_URL` environment variable for production
- Automatically switch between environments based on `NODE_ENV`

## Backend Endpoints

Your backend provides these endpoints:
- `/api/chatbot/query` - Chatbot functionality
- `/api/movies/*` - Movie data endpoints
- `/api/recommendations/*` - ML-based recommendations

## Testing the Connection

After setting the environment variables:
1. Redeploy your frontend on Vercel
2. Open the chatbot in your deployed app
3. Send a message to test the connection
4. Check the browser console for any errors

## Troubleshooting

### Common Issues:
1. **CORS errors**: Make sure your Render backend has CORS enabled (it should be)
2. **404 errors**: Verify the backend URL is correct and the service is running
3. **Environment variable not working**: Make sure to redeploy after setting environment variables

### Debug Steps:
1. Check the browser's Network tab to see the actual API calls
2. Verify the backend URL in the request
3. Check your Render backend logs for any errors
4. Ensure your backend is not in "sleep mode" (Render free tier limitation) 