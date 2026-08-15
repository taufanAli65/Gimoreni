import { prisma } from '../../config/prisma';
import { CreateUserDto, UpdateUserDto, UpdateMeDto } from './users.dto';

export class UsersRepository {
  async getAllUsers(page: number, limit: number) {
    const skip = (page - 1) * limit;
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    return { users, total };
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }

  async createUser(data: CreateUserDto & { supabaseUserId: string }) {
    return prisma.user.create({
      data: {
        supabaseUserId: data.supabaseUserId,
        email: data.email,
        name: data.name,
        role: data.role,
        allowance: data.allowance,
        balance: data.balance,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async softDeleteUser(id: string) {
    return prisma.user.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async updateMe(id: string, data: UpdateMeDto) {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async updateBalance(id: string, field: 'balance' | 'allowance', action: 'add' | 'subtract' | 'set', amount: number) {
    return prisma.user.update({
      where: { id },
      data: {
        [field]: action === 'set' ? amount : {
          [action === 'add' ? 'increment' : 'decrement']: amount,
        },
      },
    });
  }

  async countAdmins() {
    return prisma.user.count({
      where: { role: 'ADMIN', isActive: true },
    });
  }
}

export const usersRepository = new UsersRepository();
