import express from 'express';
import axios from 'axios';

const router = express.Router();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get popular movies
router.get('/popular', async (req, res) => {
    try {
        const response = await axios.get(
            `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching popular movies:', error);
        res.status(500).json({ error: 'Failed to fetch popular movies' });
    }
});

// Search movies
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;
        const response = await axios.get(
            `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${query}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error searching movies:', error);
        res.status(500).json({ error: 'Failed to search movies' });
    }
});

// Get movie details
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const response = await axios.get(
            `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        res.status(500).json({ error: 'Failed to fetch movie details' });
    }
});

export const movieRoutes = router; 