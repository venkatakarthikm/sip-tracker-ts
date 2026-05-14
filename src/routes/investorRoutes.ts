import { Router } from 'express';
import * as investorController from '../controllers/investorController';
import auth from '../middleware/auth';

const router = Router();

router.post('/register', investorController.register);
router.post('/login', investorController.login);
router.get('/:investorId/networth', auth, investorController.getNetWorth);
router.get('/holdings/:investorId', auth, investorController.getInvestorHoldings);
router.get('/:investorId', auth, investorController.getInvestorById);
router.post('/logout', auth, investorController.logout);

export default router;