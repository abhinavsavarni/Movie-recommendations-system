import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Grid,
    Typography,
    Box,
    Paper,
    Chip,
    CircularProgress,
    Button,
    Dialog,
    DialogContent,
    IconButton,
    Link,
    Tooltip,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import MovieIcon from '@mui/icons-material/Movie';
import axios from 'axios';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [trailer, setTrailer] = useState(null);
    const [openTrailer, setOpenTrailer] = useState(false);
    const [watchProviders, setWatchProviders] = useState(null);

    const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                setLoading(true);
                const [movieResponse, videosResponse, providersResponse] = await Promise.all([
                    axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`),
                    axios.get(`${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}`),
                    axios.get(`${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`)
                ]);

                setMovie(movieResponse.data);
                const trailerVideo = videosResponse.data.results.find(
                    video => video.type === 'Trailer' && video.site === 'YouTube'
                );
                setTrailer(trailerVideo);
                setWatchProviders(providersResponse.data.results.US || {});
            } catch (error) {
                console.error('Error fetching movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchMovieDetails();
        }
    }, [id, API_KEY]);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!movie) {
        return (
            <Container>
                <Typography variant="h5" color="error">
                    Movie not found
                </Typography>
            </Container>
        );
    }

    const getStreamingLinks = () => {
        const links = [];
        if (watchProviders?.flatrate) {
            watchProviders.flatrate.forEach(provider => {
                let link = '';
                switch (provider.provider_name.toLowerCase()) {
                    case 'netflix':
                        link = `https://www.netflix.com/title/${movie.netflix_id || ''}`;
                        break;
                    case 'prime':
                        link = `https://www.amazon.com/gp/video/detail/${movie.amazon_id || ''}`;
                        break;
                    case 'hulu':
                        link = `https://www.hulu.com/movie/${movie.hulu_id || ''}`;
                        break;
                    case 'disney plus':
                        link = `https://www.disneyplus.com/movies/${movie.disney_id || ''}`;
                        break;
                    case 'hbo max':
                        link = `https://play.hbomax.com/feature/${movie.hbo_id || ''}`;
                        break;
                    default:
                        link = `https://www.themoviedb.org/movie/${id}/watch`;
                }
                links.push({
                    name: provider.provider_name,
                    logo: `https://image.tmdb.org/t/p/original${provider.logo_path}`,
                    link
                });
            });
        }
        return links;
    };

    return (
        <Box
            sx={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                position: 'relative',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                },
            }}
        >
            <Container maxWidth="lg" sx={{ position: 'relative', pt: 4, pb: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Paper
                            elevation={3}
                            sx={{
                                overflow: 'hidden',
                                borderRadius: 2,
                                position: 'relative',
                            }}
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                                alt={movie.title}
                                style={{ width: '100%', height: 'auto' }}
                            />
                            {trailer && (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<PlayArrowIcon />}
                                    onClick={() => setOpenTrailer(true)}
                                    sx={{
                                        position: 'absolute',
                                        bottom: 16,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                    }}
                                >
                                    Watch Trailer
                                </Button>
                            )}
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={8}>
                        <Box sx={{ color: 'white' }}>
                            <Typography variant="h3" gutterBottom>
                                {movie.title}
                            </Typography>
                            <Box sx={{ mb: 2 }}>
                                {movie.genres.map((genre) => (
                                    <Chip
                                        key={genre.id}
                                        label={genre.name}
                                        sx={{ mr: 1, mb: 1 }}
                                        color="primary"
                                    />
                                ))}
                            </Box>
                            <Typography variant="body1" paragraph>
                                {movie.overview}
                            </Typography>
                            <Grid container spacing={2} sx={{ mb: 3 }}>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Release Date
                                    </Typography>
                                    <Typography variant="body1">
                                        {new Date(movie.release_date).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Runtime
                                    </Typography>
                                    <Typography variant="body1">
                                        {movie.runtime} minutes
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={3}>
                                    <Typography variant="subtitle1" color="text.secondary">
                                        Rating
                                    </Typography>
                                    <Typography variant="body1">
                                        {movie.vote_average.toFixed(1)}/10
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                                    Where to Watch
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {getStreamingLinks().length > 0 ? (
                                        getStreamingLinks().map((provider) => (
                                            <Tooltip key={provider.name} title={`Watch on ${provider.name}`}>
                                                <Link
                                                    href={provider.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    sx={{ textDecoration: 'none' }}
                                                >
                                                    <Button
                                                        variant="contained"
                                                        startIcon={
                                                            <img
                                                                src={provider.logo}
                                                                alt={provider.name}
                                                                style={{ width: 24, height: 24, marginRight: 8 }}
                                                            />
                                                        }
                                                        sx={{
                                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                                            '&:hover': {
                                                                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                                            },
                                                        }}
                                                    >
                                                        {provider.name}
                                                    </Button>
                                                </Link>
                                            </Tooltip>
                                        ))
                                    ) : (
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MovieIcon sx={{ color: 'white' }} />
                                            <Typography variant="body1" sx={{ color: 'white' }}>
                                                No streaming options available at the moment
                                            </Typography>
                                        </Box>
                                    )}
                                </Box>
                            </Box>
                            <Button
                                variant="contained"
                                color="primary"
                                size="large"
                                onClick={() => window.history.back()}
                            >
                                Back to Movies
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Container>

            <Dialog
                open={openTrailer}
                onClose={() => setOpenTrailer(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogContent sx={{ p: 0, position: 'relative' }}>
                    <IconButton
                        onClick={() => setOpenTrailer(false)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'white',
                            zIndex: 1,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    {trailer && (
                        <iframe
                            width="100%"
                            height="500"
                            src={`https://www.youtube.com/embed/${trailer.key}`}
                            title="Movie Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
};

export default MovieDetails; 