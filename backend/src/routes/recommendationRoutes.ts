import express from 'express';
import { PythonShell, Options } from 'python-shell';
import path from 'path';

const router = express.Router();

// Get movie recommendations using ML model
router.post('/predict', async (req, res) => {
    try {
        const { movieId } = req.body;

        const options: Options = {
            mode: 'text' as const,
            pythonPath: 'python',
            pythonOptions: ['-u'],
            scriptPath: path.join(__dirname, '../../ml_model'),
            args: [movieId.toString()],
        };

        PythonShell.run('recommend.py', options).then((results) => {
            if (results && results.length > 0) {
                const recommendations = JSON.parse(results[0]);
                res.json(recommendations);
            } else {
                res.status(500).json({ error: 'Failed to get recommendations' });
            }
        });
    } catch (error) {
        console.error('Error getting recommendations:', error);
        res.status(500).json({ error: 'Failed to get recommendations' });
    }
});

export const recommendationRoutes = router; 