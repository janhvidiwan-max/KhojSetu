import { Router } from 'express';
import { getAuditLogs } from '../controllers/auditController';
import { protect, restrictTo } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getAuditLogs);

export default router;
