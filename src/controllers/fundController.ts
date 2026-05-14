import { Request, Response } from 'express';
import FundModel, { CreateFundData } from '../models/fundModel';

const getFunds = async (req: Request, res: Response): Promise<void> => {
    try {
        const rows = await FundModel.getAll();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const addFund = async (req: Request<{}, {}, CreateFundData>, res: Response): Promise<void> => {
    try {
        const result = await FundModel.create(req.body);
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const updateNav = async (req: Request<{ fundId: string }, {}, { current_nav: number }>, res: Response): Promise<void> => {
    try {
        await FundModel.updateNav(req.params.fundId, req.body.current_nav);
        res.json({ message: "NAV updated successfully" });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export { getFunds, addFund, updateNav };