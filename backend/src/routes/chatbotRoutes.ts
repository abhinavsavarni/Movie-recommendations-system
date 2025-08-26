import express, { Request, Response, Router } from 'express';
import dialogflow from '@google-cloud/dialogflow';
import { v4 as uuidv4 } from 'uuid';
// import axios from 'axios'; // Axios removed for TMDB calls
import https from 'https';

const router: Router = express.Router();

const DIALOGFLOW_PROJECT_ID = process.env.DIALOGFLOW_PROJECT_ID || 'your-dialogflow-project-id';
const sessionId = uuidv4();
const sessionClient = new dialogflow.SessionsClient();
const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const genreMap: { [key: string]: number } = {
    "action": 28, "adventure": 12, "animation": 16, "comedy": 35, "crime": 80,
    "documentary": 99, "drama": 18, "family": 10751, "fantasy": 14, "history": 36,
    "horror": 27, "music": 10402, "mystery": 9648, "romance": 10749,
    "science fiction": 878, "tv movie": 10770, "thriller": 53, "war": 10752, "western": 37
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const tmdbHttpRequest = async (url: string, maxRetries = 3, attempt = 1): Promise<any> => {
    const baseDelayMs = 1500; // Initial delay before first retry
    console.log(`Attempting direct HTTPS request (Attempt ${attempt}/${maxRetries + 1}) to: ${url}`);

    const options = {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.102 Safari/537.36',
            'Accept': 'application/json'
        },
        timeout: 15000 // 15 seconds timeout for the request
    };

    return new Promise((resolve, reject) => {
        const req = https.get(url, options, (res) => {
            let data = '';
            console.log(`TMDB HTTPS Status Code (Attempt ${attempt}):`, res.statusCode);

            if (res.statusCode !== 200) {
                res.resume();
                const statusError = new Error(`Request Failed. Status Code: ${res.statusCode}`);
                // @ts-ignore
                statusError.statusCode = res.statusCode;
                // For 5xx errors, we might consider retrying, but for now, only network errors trigger retry below.
                reject(statusError);
                return;
            }

            res.on('data', (chunk) => { data += chunk; });
            res.on('end', () => {
                try { resolve(JSON.parse(data)); }
                catch (e: any) {
                    console.error(`TMDB HTTPS JSON parsing error (Attempt ${attempt}):`, e.message);
                    reject(new Error('Failed to parse TMDB response.'));
                }
            });
        });

        req.on('timeout', () => {
            req.destroy();
            const timeoutError = new Error('TMDB request timed out after 15s.');
            console.error(`TMDB HTTPS Request Timeout (Attempt ${attempt}):`, url);
            if (attempt <= maxRetries) {
                const currentDelay = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
                console.log(`Retrying after timeout... (delaying ${currentDelay}ms)`);
                delay(currentDelay).then(() => tmdbHttpRequest(url, maxRetries, attempt + 1)).then(resolve).catch(reject);
            } else {
                reject(timeoutError);
            }
        });

        req.on('error', (err: any) => {
            console.error(`TMDB HTTPS Request Error (Attempt ${attempt}):`, err.message);
            console.error(`TMDB HTTPS Error Code (Attempt ${attempt}):`, err.code);
            if ((err.code === 'ECONNRESET' || err.code === 'ETIMEDOUT' || err.code === 'ENOTFOUND' || err.code === 'EAI_AGAIN') && attempt <= maxRetries) {
                const currentDelay = baseDelayMs * Math.pow(2, attempt - 1); // Exponential backoff
                console.log(`Retrying due to ${err.code}... (delaying ${currentDelay}ms)`);
                delay(currentDelay).then(() => tmdbHttpRequest(url, maxRetries, attempt + 1)).then(resolve).catch(reject);
            } else {
                reject(err);
            }
        });
    });
};

router.post('/query', async (req: Request, res: Response) => {
    const { queryText, languageCode = 'en-US' } = req.body;

    if (!queryText) return res.status(400).send({ error: 'queryText is required' });
    if (!TMDB_API_KEY) return res.status(500).send({ error: 'Server configuration error: TMDB API key missing.' });

    const sessionPath = sessionClient.projectAgentSessionPath(DIALOGFLOW_PROJECT_ID, sessionId);
    const dialogflowRequest = { session: sessionPath, queryInput: { text: { text: queryText, languageCode: languageCode } } };

    try {
        console.log(`Sending DFlow query: ${queryText}`);
        const responses = await sessionClient.detectIntent(dialogflowRequest);
        const result = responses[0].queryResult;

        if (result && result.intent && result.parameters && result.parameters.fields) {
            console.log(`  DFlow Intent: ${result.intent.displayName}`);
            let movies: any[] = [];
            let customResponse = result.fulfillmentText || "Here's what I found:";
            let tmdbData;

            if (result.intent.displayName === 'RecommendMovieByGenreYear') {
                const genreName = result.parameters.fields.genre?.stringValue?.toLowerCase();
                const yearValue = result.parameters.fields.year?.numberValue || result.parameters.fields.year?.stringValue;
                const genreId = genreName ? genreMap[genreName] : undefined;
                let discoverUrl = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc`;
                if (genreId) discoverUrl += `&with_genres=${genreId}`;
                if (yearValue) {
                    const parsedYear = parseInt(String(yearValue));
                    if (!isNaN(parsedYear) && String(parsedYear).length === 4) discoverUrl += `&primary_release_year=${parsedYear}`;
                }

                console.log(`Fetching from TMDB (direct https with retries): ${discoverUrl}`);
                tmdbData = await tmdbHttpRequest(discoverUrl);
                movies = tmdbData.results?.slice(0, 5).map((movie: any) => ({ title: movie.title, overview: movie.overview, release_date: movie.release_date })) || [];

                if (movies.length === 0 && customResponse === "Here's what I found:") {
                    customResponse = "I couldn't find movies for that. Try different criteria?";
                }

            } else if (result.intent.displayName === 'RecommendMovieByMood') {
                const moodKeywords = result.parameters.fields.mood_keywords?.stringValue;
                if (moodKeywords) {
                    const searchUrl = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(moodKeywords)}`;
                    console.log(`Fetching from TMDB (direct https with retries): ${searchUrl}`);
                    tmdbData = await tmdbHttpRequest(searchUrl);
                    movies = tmdbData.results?.slice(0, 5).map((movie: any) => ({ title: movie.title, overview: movie.overview, release_date: movie.release_date })) || [];
                    if (movies.length === 0) customResponse = "I couldn't find any movies matching those keywords.";
                } else {
                    customResponse = "You asked for a mood, but didn't specify any keywords.";
                }
            }
            res.send({ dialogflowResponse: customResponse, intent: result.intent.displayName, parameters: result.parameters.fields, movies: movies });
        } else {
            res.send({ dialogflowResponse: result?.fulfillmentText || "I'm not sure how to help with that.", movies: [] });
        }
    } catch (error: any) {
        console.error('ERROR processing chatbot request:');
        if (error.isAxiosError) {
            console.error('Axios-like Error Code:', error.code);
            console.error('Axios-like Error Message:', error.message);
            if (error.request) console.error('Axios-like Request Data (config url):', error.config?.url);
        } else {
            console.error('General Error Code:', error.code);
            console.error('General Error Message:', error.message);
            // @ts-ignore 
            if (error.statusCode) console.error('General Error Status Code:', error.statusCode);
            console.error(error);
        }
        res.status(500).send({ error: 'Error processing your request. The movie database might be temporarily busy or unavailable.' });
    }
});

export { router as chatbotRoutes }; 