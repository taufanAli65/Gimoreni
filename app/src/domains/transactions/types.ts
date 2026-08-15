export type TransactionType = 'INCOME' | 'EXPENSE';

export interface Category {
  id: string;
  name: string;
  icon?: string | null;
  color?: string | null;
  visibility: 'ALL' | 'ADMIN_ONLY' | 'USER_ONLY';
}

export interface Transaction {
  id: string;
  userId: string;
  categoryId: string;
  type: TransactionType;
  amount: string; // Decimal from prisma often comes as string in JSON
  description?: string | null;
  date: string;
  receiptUrl?: string | null;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

export interface TransactionSummary {
  userId: string;
  userName: string;
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  missedDays: number;
}
