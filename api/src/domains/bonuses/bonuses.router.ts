import { Router } from 'express';
import { bonusesController } from './bonuses.controller';
import { authenticate } from '../../shared/middleware/auth.middleware';
import { requireRole } from '../../shared/middleware/requireRole.middleware';

const router = Router();

// All bonus routes are ADMIN only
router.use(authenticate);
router.use(requireRole('ADMIN'));

router.get('/', bonusesController.getAll);
router.get('/:id', bonusesController.getById);
router.post('/', bonusesController.create);
router.patch('/:id', bonusesController.update);
router.delete('/:id', bonusesController.delete);
router.post('/:id/apply', bonusesController.apply);

export { router as bonusesRouter };
