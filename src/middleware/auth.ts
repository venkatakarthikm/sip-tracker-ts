import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import pool from '../models/pgManager';

export interface JwtPayload {
    id: number;
}

// Extend Express Request to include user and token
declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload;
            token?: string;
        }
    }
}

const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers['authorization']?.split(' ')[1] ?? req.headers['authorization'];

    if (!token) {
        res.status(401).json({ error: "Access Denied" });
        return;
    }

    try {
        const blacklistCheck = await pool.query(
            "SELECT token FROM token_blacklist WHERE token = $1",
            [token]
        );

        if (blacklistCheck.rows.length > 0) {
            res.status(401).json({ error: "Token expired/Logged out" });
            return;
        }

        const verified = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        req.user = verified;
        req.token = token;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid Token or Session Expired" });
    }
};

export default auth;