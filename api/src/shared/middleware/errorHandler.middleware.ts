import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/AppError';
import { error } from '../utils/response.util';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(error(err.code, err.message));
  }

  // Handle generic or unknown errors
  return res.status(500).json(error('INTERNAL_SERVER_ERROR', 'An unexpected error occurred.'));
};
