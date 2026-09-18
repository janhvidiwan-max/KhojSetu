import { Router } from 'express';
import { getMatches, getMatchById, reviewMatch } from '../controllers/matchController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getMatches);
router.get('/:id', getMatchById);
router.put('/:id/review', protect, reviewMatch);

export default router;
