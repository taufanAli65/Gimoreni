import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env';
import { error } from '../utils/response.util';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json(error('UNAUTHORIZED', 'Missing or invalid token'));
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as NonNullable<Request['user']>;
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json(error('UNAUTHORIZED', 'Invalid or expired token'));
    return;
  }
};
