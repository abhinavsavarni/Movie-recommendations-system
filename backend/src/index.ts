import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { movieRoutes } from './routes/movieRoutes';
import { recommendationRoutes } from './routes/recommendationRoutes';
import { chatbotRoutes } from './routes/chatbotRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: [
    'http://localhost:3000', // Development frontend
    'http://localhost:5173', // Alternative dev port
    process.env.FRONTEND_URL, // Production frontend URL
    'https://*.vercel.app', // Vercel deployments
  ].filter(Boolean), // Remove undefined values
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/movies', movieRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/chatbot', chatbotRoutes);

// MongoDB connection
mongoose
    .connect(process.env.MONGODB_URI || 'mongodb+srv://guptasaanvi2005:saanvi@cluster0.35vyvrm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 