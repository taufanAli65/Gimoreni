import { Router } from 'express';
import { usersController } from './users.controller';
import { authenticate, requireRole } from '../../shared/middleware/auth.middleware';
import { paginationMiddleware } from '../../shared/middleware/pagination.middleware';
import { Role } from '../../shared/constants/roles';

const router = Router();

// User self-service
router.patch('/me', authenticate, usersController.updateMe);

// Admin-only endpoints
router.get('/', authenticate, requireRole(Role.ADMIN), paginationMiddleware, usersController.getAllUsers);
router.get('/:id', authenticate, requireRole(Role.ADMIN), usersController.getUserById);
router.post('/', authenticate, requireRole(Role.ADMIN), usersController.createUser);
router.patch('/:id', authenticate, requireRole(Role.ADMIN), usersController.updateUser);
router.delete('/:id', authenticate, requireRole(Role.ADMIN), usersController.softDeleteUser);
router.patch('/:id/balance', authenticate, requireRole(Role.ADMIN), usersController.updateBalance);

export { router as usersRouter };
