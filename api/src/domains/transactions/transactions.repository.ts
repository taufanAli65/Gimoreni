import { PrismaClient, Transaction, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export class TransactionsRepository {
  async findMany(params: {
    skip?: number;
    take?: number;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput;
  }): Promise<Transaction[]> {
    const { skip, take, where, orderBy } = params;
    return prisma.transaction.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        category: true,
      }
    });
  }

  async count(where?: Prisma.TransactionWhereInput): Promise<number> {
    return prisma.transaction.count({ where });
  }

  async findById(id: string): Promise<Transaction | null> {
    return prisma.transaction.findUnique({
      where: { id },
      include: {
        category: true,
      }
    });
  }

  async create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction> {
    return prisma.transaction.create({
      data,
      include: {
        category: true,
      }
    });
  }

  async update(id: string, data: Prisma.TransactionUncheckedUpdateInput): Promise<Transaction> {
    return prisma.transaction.update({
      where: { id },
      data,
      include: {
        category: true,
      }
    });
  }

  async delete(id: string): Promise<Transaction> {
    return prisma.transaction.delete({
      where: { id },
    });
  }

  async upsertStreakLog(userId: string, date: Date) {
    // Strip time component to get pure date for StreakLog
    const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    
    return prisma.streakLog.upsert({
      where: {
        userId_date: {
          userId,
          date: dateOnly,
        }
      },
      update: {
        didLog: true,
      },
      create: {
        userId,
        date: dateOnly,
        didLog: true,
      }
    });
  }
  
  async countTransactionsByDate(userId: string, date: Date): Promise<number> {
     const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
     return prisma.transaction.count({
       where: {
         userId,
         date: dateOnly,
       }
     });
  }

  async updateStreakLogStatus(userId: string, date: Date, didLog: boolean) {
    const dateOnly = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    return prisma.streakLog.update({
      where: {
         userId_date: {
           userId,
           date: dateOnly,
         }
      },
      data: {
        didLog
      }
    });
  }

  async getSummary(month?: number, year?: number) {
    // Default to current month/year if not provided
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1; // 1-12
    const targetYear = year ?? now.getFullYear();

    // Find start and end date for the month (UTC)
    const startDate = new Date(Date.UTC(targetYear, targetMonth - 1, 1));
    const endDate = new Date(Date.UTC(targetYear, targetMonth, 1));

    // Get all users
    const users = await prisma.user.findMany({
      select: { id: true, name: true }
    });

    // We can do this with raw SQL or parallel Prisma queries. Since we need missedDays from StreakLog, 
    // let's do parallel queries for simplicity or raw SQL.
    const result = [];
    
    for (const user of users) {
      const aggregates = await prisma.transaction.groupBy({
        by: ['type'],
        where: {
          userId: user.id,
          date: {
            gte: startDate,
            lt: endDate,
          }
        },
        _sum: {
          amount: true
        }
      });
      
      const missedDaysCount = await prisma.streakLog.count({
        where: {
          userId: user.id,
          date: {
            gte: startDate,
            lt: endDate,
          },
          didLog: false
        }
      });
      
      let income = 0;
      let expense = 0;
      
      for (const agg of aggregates) {
         if (agg.type === 'INCOME') income = Number(agg._sum.amount || 0);
         if (agg.type === 'EXPENSE') expense = Number(agg._sum.amount || 0);
      }

      result.push({
        userId: user.id,
        userName: user.name,
        month: targetMonth,
        year: targetYear,
        totalIncome: income,
        totalExpense: expense,
        missedDays: missedDaysCount,
      });
    }
    
    return result;
  }

  async getCalendar(userId?: string, month?: number, year?: number) {
    const now = new Date();
    const targetMonth = month ?? now.getMonth() + 1;
    const targetYear = year ?? now.getFullYear();

    const startDate = new Date(Date.UTC(targetYear, targetMonth - 1, 1));
    const endDate = new Date(Date.UTC(targetYear, targetMonth, 1));

    const where: Prisma.StreakLogWhereInput = {
      date: {
        gte: startDate,
        lt: endDate,
      },
      didLog: true
    };
    
    if (userId) {
       where.userId = userId;
    }
    
    // We want unique dates where didLog is true.
    const streakLogs = await prisma.streakLog.findMany({
      where,
      select: {
        date: true
      },
      distinct: ['date']
    });

    return streakLogs.map(s => s.date.toISOString().split('T')[0]);
  }
}

export const transactionsRepository = new TransactionsRepository();
