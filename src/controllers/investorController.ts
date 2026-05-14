import { Request, Response } from 'express';
import InvestorModel, { CreateInvestorData } from '../models/investorModel';

const register = async (req: Request<{}, {}, CreateInvestorData>, res: Response): Promise<void> => {
    try {
        const result = await InvestorModel.createInvestor(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const login = async (req: Request<{}, {}, { email: string; password: string }>, res: Response): Promise<void> => {
    try {
        const result = await InvestorModel.loginInvestor(req.body.email, req.body.password);
        res.json(result);
    } catch (err) {
        res.status(401).json({ error: (err as Error).message });
    }
};

const getInvestorById = async (req: Request<{ investorId: string }>, res: Response): Promise<void> => {
    try {
        const result = await InvestorModel.getInvestorById(req.params.investorId);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const getInvestorHoldings = async (req: Request<{ investorId: string }>, res: Response): Promise<void> => {
    try {
        const rows = await InvestorModel.getHoldings(req.params.investorId);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const getNetWorth = async (req: Request<{ investorId: string }>, res: Response): Promise<void> => {
    try {
        const row = await InvestorModel.getNetWorth(req.params.investorId);
        res.json(row);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        await InvestorModel.logout(req.token as string);
        res.json({ message: "Logged out successfully" });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export { register, login, getNetWorth, getInvestorById, getInvestorHoldings, logout };