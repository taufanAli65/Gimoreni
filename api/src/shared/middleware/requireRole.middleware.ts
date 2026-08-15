import { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { error } from '../utils/response.util';

export const requireRole = (requiredRole: Role) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json(error('UNAUTHORIZED', 'User not authenticated'));
      return;
    }

    if (req.user.role !== requiredRole) {
      res.status(403).json(error('FORBIDDEN', `Requires ${requiredRole} role`));
      return;
    }

    next();
  };
};
