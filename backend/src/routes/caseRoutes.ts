import { Router } from 'express';
import { getCases, getCaseById, createCase, updateCase, deleteCase } from '../controllers/caseController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', getCases);
router.get('/:id', getCaseById);
router.post('/', protect, createCase);
router.put('/:id', protect, updateCase);
router.delete('/:id', protect, deleteCase);

export default router;
