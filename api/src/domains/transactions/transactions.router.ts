import { Router } from 'express';
import { transactionsController } from './transactions.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/requireRole.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Admin only routes
router.get('/summary', requireRole('ADMIN'), transactionsController.getSummary);
router.get('/calendar', requireRole('ADMIN'), transactionsController.getCalendar);

// General routes (Both USER and ADMIN)
router.get('/', transactionsController.getTransactions);
router.post('/', transactionsController.createTransaction);
router.get('/:id', transactionsController.getTransaction);
router.patch('/:id', transactionsController.updateTransaction);
router.delete('/:id', transactionsController.deleteTransaction);

export { router as transactionsRouter };
