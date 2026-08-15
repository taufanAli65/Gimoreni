import { Request, Response, NextFunction } from 'express';
import { transactionsService } from './transactions.service';
import { CreateTransactionDto, UpdateTransactionDto, TransactionFilterDto, CalendarFilterDto, SummaryFilterDto } from './transactions.dto';
import { AppError } from '../../shared/utils/AppError';

export class TransactionsController {
  async getTransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedQuery = TransactionFilterDto.safeParse(req.query);
      if (!parsedQuery.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedQuery.error.message);
      }

      const { transactions, total, page, limit } = await transactionsService.findMany(
        parsedQuery.data,
        req.user!.sub,
        req.user!.role
      );

      res.status(200).json({
        success: true,
        data: transactions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const transaction = await transactionsService.findById(req.params.id as string, req.user!.sub, req.user!.role);
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async createTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedBody = CreateTransactionDto.safeParse(req.body);
      if (!parsedBody.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedBody.error.message);
      }

      const transaction = await transactionsService.create(req.user!.sub, parsedBody.data);
      res.status(201).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedBody = UpdateTransactionDto.safeParse(req.body);
      if (!parsedBody.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedBody.error.message);
      }

      const transaction = await transactionsService.update(req.params.id as string, req.user!.sub, req.user!.role, parsedBody.data);
      res.status(200).json({ success: true, data: transaction });
    } catch (error) {
      next(error);
    }
  }

  async deleteTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      await transactionsService.delete(req.params.id as string, req.user!.sub, req.user!.role);
      res.status(200).json({ success: true, data: { deleted: true } });
    } catch (error) {
      next(error);
    }
  }

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedQuery = SummaryFilterDto.safeParse(req.query);
      if (!parsedQuery.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedQuery.error.message);
      }
      
      const summary = await transactionsService.getSummary(parsedQuery.data.month, parsedQuery.data.year);
      res.status(200).json({ success: true, data: summary });
    } catch (error) {
      next(error);
    }
  }

  async getCalendar(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedQuery = CalendarFilterDto.safeParse(req.query);
      if (!parsedQuery.success) {
        throw new AppError(400, 'BAD_REQUEST', parsedQuery.error.message);
      }

      const dates = await transactionsService.getCalendar(parsedQuery.data.userId, parsedQuery.data.month, parsedQuery.data.year);
      res.status(200).json({ success: true, data: dates });
    } catch (error) {
      next(error);
    }
  }
}

export const transactionsController = new TransactionsController();
