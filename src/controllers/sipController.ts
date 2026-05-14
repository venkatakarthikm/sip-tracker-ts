import { Request, Response } from 'express';
import SIPModel, { CreateSIPData } from '../models/sipModel';

const processSIP = async (req: Request<{ sipId: string }>, res: Response): Promise<void> => {
    try {
        const result = await SIPModel.processInstallment(req.params.sipId);
        res.status(201).json({ message: "SIP Installment Processed", data: result });
    } catch (err) {
        res.status(500).json({ error: typeof err === 'string' ? err : (err as Error).message });
    }
};

const getTransactions = async (req: Request<{ investorId: string }>, res: Response): Promise<void> => {
    try {
        const rows = await SIPModel.getTransactions(req.params.investorId);
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const getSipById = async (req: Request<{ sipId: string }>, res: Response): Promise<void> => {
    try {
        const sip = await SIPModel.getSipById(req.params.sipId);
        res.json(sip);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const createSIP = async (req: Request<{}, {}, CreateSIPData>, res: Response): Promise<void> => {
    try {
        const result = await SIPModel.createSIP(req.body);
        res.status(201).json({ message: "SIP Created", data: result });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

const getSIPsByInvestor = async (req: Request<{ investorId: string }>, res: Response): Promise<void> => {
    try {
        const sips = await SIPModel.getSipByInvestorId(req.params.investorId);
        res.json(sips);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
};

export { processSIP, getTransactions, getSipById, createSIP, getSIPsByInvestor };