# Backend Deployment Configuration

This guide explains how to configure your backend deployed on Render to work with your Vercel frontend.

## Environment Variables

Set these environment variables in your Render service:

### Required Variables:
```
MONGODB_URI=your_mongodb_connection_string
DIALOGFLOW_PROJECT_ID=your_dialogflow_project_id
TMDB_API_KEY=your_tmdb_api_key
```

### Optional Variables:
```
FRONTEND_URL=https://movie-recommendations-system-taupe.vercel.app
PORT=5000
```

## CORS Configuration

The backend is configured to allow requests from:
- Local development: `http://localhost:3000`, `http://localhost:5173`
- Vercel deployments: `https://*.vercel.app`
- Custom frontend URL: Set via `FRONTEND_URL` environment variable

## Render Service Configuration

1. **Build Command**: `npm install && npm run build`
2. **Start Command**: `npm start`
3. **Environment**: Node.js
4. **Port**: 10000 (Render free tier requirement)
5. **Auto-Deploy**: Enable for automatic deployments

**Important:** Make sure your Render service is configured with:
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Port: 10000

## Health Check Endpoint

Add a health check endpoint to your backend:

```typescript
// Add this route in src/index.ts
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});
```

## Testing the Connection

1. Deploy your backend to Render
2. Test the health endpoint: `https://your-app.onrender.com/health`
3. Test the chatbot endpoint: `https://your-app.onrender.com/api/chatbot/query`
4. Check Render logs for any errors

## Common Issues

### 1. CORS Errors
- Ensure your frontend URL is in the allowed origins
- Check that the `FRONTEND_URL` environment variable is set correctly

### 2. Service Sleeping (Free Tier)
- Render free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Consider upgrading to paid tier for production use

### 3. Environment Variables Not Loading
- Make sure to redeploy after adding environment variables
- Check that variable names match exactly (case-sensitive)
- Verify no extra spaces in values

### 4. MongoDB Connection Issues
- Ensure your MongoDB Atlas cluster is accessible
- Check IP whitelist settings
- Verify connection string format

## Monitoring

- Use Render's built-in logging
- Set up alerts for service failures
- Monitor response times and error rates
- Check MongoDB connection status regularly 