import pool from './pgManager';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface Investor {
    id: number;
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface InvestorPublic {
    id: number;
    name: string;
    email: string;
    phone: string;
}

export interface CreateInvestorData {
    name: string;
    email: string;
    password: string;
    phone: string;
}

export interface LoginResult {
    token: string;
    user: { id: number; name: string };
}

export interface Holding {
    fund_name: string;
    total_units: number;
    current_nav: number;
    current_value: number;
}

export interface NetWorth {
    total_net_worth: number;
}

const createInvestor = async (data: CreateInvestorData): Promise<{ id: number }> => {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const sql = `INSERT INTO investors (name, email, password, phone) VALUES ($1, $2, $3, $4) RETURNING id`;

    return new Promise((resolve, reject) => {
        pool.query(sql, [data.name, data.email, hashedPassword, data.phone], (err, result) => {
            if (err) return reject(err);
            resolve({ id: result.rows[0].id });
        });
    });
};

const loginInvestor = async (email: string, password: string): Promise<LoginResult> => {
    const sql = `SELECT * FROM investors WHERE email = $1`;

    const user = await new Promise<Investor | undefined>((resolve, reject) => {
        pool.query(sql, [email], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows[0] as Investor | undefined);
        });
    });

    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, { expiresIn: '10h' });
    return { token, user: { id: user.id, name: user.name } };
};

const logout = (token: string): Promise<void> => {
    const sql = `INSERT INTO token_blacklist (token) VALUES ($1)`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [token], (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
};

const getInvestorById = (id: string | number): Promise<InvestorPublic> => {
    const sql = `SELECT id, name, email, phone FROM investors WHERE id = $1`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows[0] as InvestorPublic);
        });
    });
};

const getHoldings = (investorId: string | number): Promise<Holding[]> => {
    const sql = `
        SELECT f.fund_name, SUM(t.units_allotted) as total_units, 
        f.current_nav, (SUM(t.units_allotted) * f.current_nav) as current_value
        FROM transactions t
        JOIN funds f ON t.fund_id = f.id
        WHERE t.investor_id = $1
        GROUP BY f.id`;
    return new Promise((resolve, reject) => {
        pool.query(sql, [investorId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows as Holding[]);
        });
    });
};

const getNetWorth = async (investorId: string | number): Promise<NetWorth> => {
    const sql = `
        SELECT SUM(t.units_allotted * f.current_nav) as total_net_worth
        FROM transactions t
        JOIN funds f ON t.fund_id = f.id
        WHERE t.investor_id = $1`;

    const row = await new Promise<{ total_net_worth: number | null }>((resolve, reject) => {
        pool.query(sql, [investorId], (err, result) => {
            if (err) return reject(err);
            resolve(result.rows[0]);
        });
    });
    return { total_net_worth: row.total_net_worth ?? 0 };
};

export default { createInvestor, loginInvestor, getNetWorth, getInvestorById, getHoldings, logout };