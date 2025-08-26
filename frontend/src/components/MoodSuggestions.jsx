import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    CardMedia,
    CircularProgress,
    Tooltip,
    Divider,
} from '@mui/material';
import {
    SentimentSatisfiedAlt,
    SentimentVeryDissatisfied,
    Favorite,
    EmojiEmotions,
    LocalMovies,
    Psychology,
    SportsEsports,
    SelfImprovement,
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MoodSuggestions = () => {
    const [selectedMood, setSelectedMood] = useState(null);
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    const moods = [
        {
            name: 'Happy',
            icon: <SentimentSatisfiedAlt />,
            genres: [35], // Comedy
            keywords: ['feel-good', 'uplifting', 'comedy'],
            yearRange: '2020-2024',
            minRating: 7.0
        },
        {
            name: 'Sad',
            icon: <SentimentVeryDissatisfied />,
            genres: [18], // Drama
            keywords: ['emotional', 'drama', 'heartfelt'],
            yearRange: '2015-2024',
            minRating: 7.5
        },
        {
            name: 'Romantic',
            icon: <Favorite />,
            genres: [10749], // Romance
            keywords: ['romance', 'love', 'romantic'],
            yearRange: '2018-2024',
            minRating: 7.0
        },
        {
            name: 'Excited',
            icon: <EmojiEmotions />,
            genres: [28], // Action
            keywords: ['action', 'adventure', 'thrilling'],
            yearRange: '2020-2024',
            minRating: 7.0
        },
        {
            name: 'Thoughtful',
            icon: <Psychology />,
            genres: [9648], // Mystery
            keywords: ['mystery', 'psychological', 'mind-bending'],
            yearRange: '2015-2024',
            minRating: 7.5
        },
        {
            name: 'Nostalgic',
            icon: <LocalMovies />,
            genres: [36], // History
            keywords: ['classic', 'nostalgic', 'retro'],
            yearRange: '1990-2010',
            minRating: 7.0
        },
        {
            name: 'Adventurous',
            icon: <SportsEsports />,
            genres: [12], // Adventure
            keywords: ['adventure', 'journey', 'quest'],
            yearRange: '2018-2024',
            minRating: 7.0
        },
        {
            name: 'Inspiring',
            icon: <SelfImprovement />,
            genres: [18], // Drama
            keywords: ['inspirational', 'motivational', 'biography'],
            yearRange: '2015-2024',
            minRating: 7.5
        }
    ];

    const fetchMoviesByMood = async (mood) => {
        try {
            setLoading(true);
            setSelectedMood(mood);

            // Fetch movies based on genres, year range, and rating
            const [startYear, endYear] = mood.yearRange.split('-');
            const response = await axios.get(
                `${BASE_URL}/discover/movie?api_key=${API_KEY}` +
                `&with_genres=${mood.genres.join('|')}` +
                `&primary_release_date.gte=${startYear}-01-01` +
                `&primary_release_date.lte=${endYear}-12-31` +
                `&vote_average.gte=${mood.minRating}` +
                `&vote_count.gte=1000` +
                `&sort_by=vote_average.desc` +
                `&include_adult=false`
            );

            // Filter and shuffle the results to get more variety
            const filteredMovies = response.data.results
                .filter(movie => movie.poster_path && movie.backdrop_path)
                .sort(() => Math.random() - 0.5)
                .slice(0, 6);

            setMovies(filteredMovies);
        } catch (error) {
            console.error('Error fetching mood-based movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    return (
        <Box sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'white', mb: 3 }}>
                How are you feeling today?
            </Typography>

            <Grid container spacing={2} sx={{ mb: 4 }}>
                {moods.map((mood) => (
                    <Grid item key={mood.name}>
                        <Tooltip title={mood.name}>
                            <Button
                                variant={selectedMood?.name === mood.name ? "contained" : "outlined"}
                                onClick={() => fetchMoviesByMood(mood)}
                                sx={{
                                    minWidth: '60px',
                                    height: '60px',
                                    borderRadius: '50%',
                                    backgroundColor: selectedMood?.name === mood.name ? 'primary.main' : 'rgba(255, 255, 255, 0.1)',
                                    '&:hover': {
                                        backgroundColor: selectedMood?.name === mood.name ? 'primary.dark' : 'rgba(255, 255, 255, 0.2)',
                                    },
                                }}
                            >
                                {mood.icon}
                            </Button>
                        </Tooltip>
                    </Grid>
                ))}
            </Grid>

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : selectedMood && movies.length > 0 ? (
                <>
                    <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                        {selectedMood.name} Movies You Might Like
                    </Typography>
                    <Grid container spacing={3}>
                        {movies.map((movie) => (
                            <Grid item xs={12} sm={6} md={4} lg={2} key={movie.id}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        cursor: 'pointer',
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        '&:hover': {
                                            transform: 'scale(1.03)',
                                            transition: 'transform 0.2s ease-in-out',
                                        },
                                    }}
                                    onClick={() => handleMovieClick(movie.id)}
                                >
                                    <CardMedia
                                        component="img"
                                        height="300"
                                        image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                        alt={movie.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div" sx={{ color: 'white' }}>
                                            {movie.title}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                            Rating: {movie.vote_average.toFixed(1)}/10
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </>
            ) : selectedMood && !loading ? (
                <Typography variant="h6" sx={{ color: 'white', textAlign: 'center' }}>
                    No movies found for this mood. Try another mood!
                </Typography>
            ) : null}
        </Box>
    );
};

export default MoodSuggestions; 