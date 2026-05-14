import { Router } from 'express';
import * as sipController from '../controllers/sipController';
import auth from '../middleware/auth';

const router = Router();

router.post('/:sipId/process', auth, sipController.processSIP);
router.get('/transactions/:investorId', auth, sipController.getTransactions);
router.get('/:sipId', auth, sipController.getSipById);
router.get('/investor/:investorId', auth, sipController.getSIPsByInvestor);
router.post('/', auth, sipController.createSIP);

export default router;