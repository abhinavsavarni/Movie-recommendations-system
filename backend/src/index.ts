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
app.use(cors());
app.use(express.json());

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