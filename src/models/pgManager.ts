import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env' });
console.log("DATABASE_URL:", process.env.DATABASE_URL); // add this

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function testConnection(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log("✅ Database connected successfully");
        client.release();
    } catch (err) {
        console.error("❌ Connection error:", (err as Error).message);
    }
}

testConnection();

export default pool;