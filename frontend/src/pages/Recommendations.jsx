import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Box,
    CircularProgress,
    Button,
} from '@mui/material';
import axios from 'axios';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                // For demo purposes, we'll use a popular movie ID
                const movieId = 550; // Fight Club
                const response = await axios.get(
                    `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}`
                );
                setRecommendations(response.data.results);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Recommended Movies
            </Typography>
            <Grid container spacing={3}>
                {recommendations.map((movie) => (
                    <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
                        <Card
                            sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                cursor: 'pointer',
                                '&:hover': {
                                    transform: 'scale(1.02)',
                                    transition: 'transform 0.2s ease-in-out',
                                },
                            }}
                            onClick={() => handleMovieClick(movie.id)}
                        >
                            <CardMedia
                                component="img"
                                height="400"
                                image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <CardContent>
                                <Typography gutterBottom variant="h6" component="div" noWrap>
                                    {movie.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Rating: {movie.vote_average.toFixed(1)}/10
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default Recommendations; 