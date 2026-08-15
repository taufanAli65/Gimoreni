import { transactionsRepository } from './transactions.repository';
import { CreateTransactionInput, UpdateTransactionInput, TransactionFilterInput } from './transactions.dto';
import { AppError } from '../../shared/utils/AppError';
import { Prisma } from '@prisma/client';

export class TransactionsService {
  async findMany(filters: TransactionFilterInput, currentUserId: string, role: string) {
    // If USER, force userId to their own ID. If ADMIN, allow filtering by userId
    const targetUserId = role === 'ADMIN' && filters.userId ? filters.userId : currentUserId;
    
    if (role === 'USER' && filters.userId && filters.userId !== currentUserId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot view transactions for another user');
    }

    const where: Prisma.TransactionWhereInput = {
      userId: targetUserId,
    };

    if (filters.startDate || filters.endDate) {
      where.date = {};
      if (filters.startDate) where.date.gte = new Date(filters.startDate);
      if (filters.endDate) where.date.lte = new Date(filters.endDate);
    }

    if (filters.type) {
      where.type = filters.type;
    }

    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }

    const skip = (filters.page - 1) * filters.limit;
    
    const [transactions, total] = await Promise.all([
      transactionsRepository.findMany({
        skip,
        take: filters.limit,
        where,
        orderBy: { date: 'desc' }
      }),
      transactionsRepository.count(where)
    ]);

    return { transactions, total, page: filters.page, limit: filters.limit };
  }

  async findById(id: string, currentUserId: string, role: string) {
    const transaction = await transactionsRepository.findById(id);
    if (!transaction) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
    }

    if (role === 'USER' && transaction.userId !== currentUserId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot access this transaction');
    }

    return transaction;
  }

  async create(userId: string, data: CreateTransactionInput) {
    // Note: ensure date is stored correctly
    const transactionDate = new Date(data.date);
    
    const transaction = await transactionsRepository.create({
      userId,
      categoryId: data.categoryId,
      type: data.type,
      amount: data.amount,
      description: data.description,
      date: transactionDate,
      receiptUrl: data.receiptUrl,
    });

    // Side effect: update streak log
    await transactionsRepository.upsertStreakLog(userId, transactionDate);

    return transaction;
  }

  async update(id: string, userId: string, role: string, data: UpdateTransactionInput) {
    const existing = await transactionsRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
    }

    if (role === 'USER' && existing.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot update this transaction');
    }
    
    const updateData: Prisma.TransactionUncheckedUpdateInput = {
      ...data,
      date: data.date ? new Date(data.date) : undefined
    };

    return transactionsRepository.update(id, updateData);
  }

  async delete(id: string, userId: string, role: string) {
    const existing = await transactionsRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'NOT_FOUND', 'Transaction not found');
    }

    if (role === 'USER' && existing.userId !== userId) {
      throw new AppError(403, 'FORBIDDEN', 'Cannot delete this transaction');
    }

    const transaction = await transactionsRepository.delete(id);

    // Side effect: if this was the only transaction for that day, we might need to set didLog back to false.
    // Let's check how many transactions are left for this user on that day.
    const remainingCount = await transactionsRepository.countTransactionsByDate(existing.userId, existing.date);
    if (remainingCount === 0) {
      await transactionsRepository.updateStreakLogStatus(existing.userId, existing.date, false);
    }

    return transaction;
  }

  async getSummary(month?: number, year?: number) {
    return transactionsRepository.getSummary(month, year);
  }

  async getCalendar(userId?: string, month?: number, year?: number) {
    return transactionsRepository.getCalendar(userId, month, year);
  }
}

export const transactionsService = new TransactionsService();
