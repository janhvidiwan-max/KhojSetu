import { Router } from 'express';
import { analyzeVideo } from '../controllers/videoController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/analyze', protect, analyzeVideo);

export default router;
