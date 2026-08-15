import { Router } from 'express';
import { streaksController } from './streaks.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/requireRole.middleware';

const router = Router();

// User endpoints
router.get('/me', authenticate, streaksController.getMyStreak);

// Admin endpoints
router.get('/:userId', authenticate, requireRole('ADMIN'), streaksController.getUserStreak);

// CRON endpoints (System/CRON)
// In a real application, these would be protected by an internal API key or network boundary.
// Leaving them open for local development and testing purposes.
router.post('/check', streaksController.checkStreaks);
router.post('/remind', streaksController.sendReminders);

export { router as streaksRouter };
