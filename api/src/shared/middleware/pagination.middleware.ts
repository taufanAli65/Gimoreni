import { Request, Response, NextFunction } from 'express';

export const paginationMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;

  req.pagination = {
    page: page > 0 ? page : 1,
    limit: limit > 0 && limit <= 100 ? limit : 20,
  };

  next();
};
