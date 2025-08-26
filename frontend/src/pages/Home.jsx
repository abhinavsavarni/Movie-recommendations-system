import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Card,
    CardContent,
    CardMedia,
    Typography,
    TextField,
    Box,
    CircularProgress,
    IconButton,
    Tooltip,
    Divider,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import axios from 'axios';
import MoodSuggestions from '../components/MoodSuggestions';

const Home = () => {
    const [movies, setMovies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const navigate = useNavigate();

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    useEffect(() => {
        if (!searchQuery) {
            fetchTrendingMovies();
        }
    }, [searchQuery]);

    const fetchTrendingMovies = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}/trending/movie/week?api_key=${API_KEY}`
            );
            setMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching trending movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.length > 2) {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query}`
                );
                setMovies(response.data.results);
            } catch (error) {
                console.error('Error searching movies:', error);
            } finally {
                setLoading(false);
            }
        } else if (query.length === 0) {
            fetchTrendingMovies();
        }
    };

    const handleMovieClick = (movieId) => {
        navigate(`/movie/${movieId}`);
    };

    const startVoiceSearch = () => {
        if ('webkitSpeechRecognition' in window) {
            const recognition = new window.webkitSpeechRecognition();
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
            };

            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                handleSearch({ target: { value: transcript } });
            };

            recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognition.start();
        } else {
            alert('Voice search is not supported in your browser.');
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Box sx={{ mb: 4, display: 'flex', gap: 1 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={handleSearch}
                    sx={{ mb: 2 }}
                />
                <Tooltip title={isListening ? "Stop listening" : "Start voice search"}>
                    <IconButton
                        onClick={startVoiceSearch}
                        color={isListening ? "error" : "primary"}
                        sx={{ height: 56 }}
                    >
                        {isListening ? <MicOffIcon /> : <MicIcon />}
                    </IconButton>
                </Tooltip>
            </Box>

            {!searchQuery && <MoodSuggestions />}

            {!searchQuery && (
                <>
                    <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                        <LocalFireDepartmentIcon sx={{ color: '#ff4d4d', mr: 1, fontSize: 32 }} />
                        <Typography variant="h4" sx={{ color: 'white' }}>
                            Trending This Week
                        </Typography>
                    </Box>
                </>
            )}

            {loading ? (
                <Box display="flex" justifyContent="center" mt={4}>
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {movies.map((movie) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
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
                                    height="400"
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
            )}
        </Container>
    );
};

export default Home; 