import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from 'redis';

import investorRoutes from './routes/investorRoutes';
import fundRoutes from './routes/fundRoutes';
import sipRoutes from './routes/sipRoutes';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Redis client
const redisClient = createClient();
redisClient.connect().catch(console.error);

// Routes
app.use('/api/investors', investorRoutes);
app.use('/api/funds', fundRoutes);
app.use('/api/sips', sipRoutes);

// Search with Redis caching
app.get('/search', async (req: Request, res: Response) => {
    const { query } = req.query as { query: string };

    const cache = await searchFromCache(query);
    if (cache) {
        return res.json({ source: 'cache', data: cache });
    } else {
        const result = await searchInDatabase(query);
        await redisClient.set(query, JSON.stringify(result));
        return res.json({ source: 'database', data: result });
    }
});

async function searchFromCache(query: string): Promise<unknown | null> {
    const data = await redisClient.get(query);
    if (data) console.log(`Cache hit for query: ${query}`);
    return data ? JSON.parse(data) : null;
}

// Placeholder — implement your actual DB search logic here
async function searchInDatabase(query: string): Promise<unknown> {
    // TODO: implement search logic
    return [];
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));