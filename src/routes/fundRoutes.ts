import { Router } from 'express';
import * as fundController from '../controllers/fundController';
import auth from '../middleware/auth';

const router = Router();

router.get('/', auth, fundController.getFunds);
router.post('/', auth, fundController.addFund);
router.put('/:fundId/nav', auth, fundController.updateNav);

export default router;