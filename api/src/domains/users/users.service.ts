import { usersRepository } from './users.repository';
import { CreateUserDto, UpdateUserDto, UpdateMeDto, UpdateBalanceDto } from './users.dto';
import { AppError } from '../../shared/utils/AppError';
import { supabaseAdmin } from '../../config/supabase';

export class UsersService {
  async getAllUsers(page: number, limit: number) {
    return usersRepository.getAllUsers(page, limit);
  }

  async getUserById(id: string) {
    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'User not found');
    }
    return user;
  }

  async createUser(data: CreateUserDto) {
    // 1. Create in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name },
    });

    if (authError || !authData.user) {
      throw new AppError(400, 'Supabase Auth Error', authError?.message || 'Failed to create user in Auth');
    }

    const supabaseUserId = authData.user.id;

    try {
      // 2. Create in Prisma
      const user = await usersRepository.createUser({
        ...data,
        supabaseUserId,
      });
      return user;
    } catch (error) {
      // Rollback Supabase user if Prisma fails
      await supabaseAdmin.auth.admin.deleteUser(supabaseUserId);
      throw new AppError(500, 'Database Error', 'Failed to create user in database');
    }
  }

  async updateUser(id: string, data: UpdateUserDto) {
    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'User not found');
    }
    return usersRepository.updateUser(id, data);
  }

  async softDeleteUser(id: string, requesterId: string) {
    if (id === requesterId) {
      throw new AppError(400, 'Cannot delete self', 'You cannot delete your own account');
    }

    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'User not found');
    }

    if (user.role === 'ADMIN') {
      const adminCount = await usersRepository.countAdmins();
      if (adminCount <= 1) {
        throw new AppError(400, 'Cannot delete last admin', 'You cannot delete the last active admin');
      }
    }

    return usersRepository.softDeleteUser(id);
  }

  async updateMe(id: string, data: UpdateMeDto) {
    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'User not found');
    }
    return usersRepository.updateMe(id, data);
  }

  async updateBalance(id: string, data: UpdateBalanceDto) {
    const user = await usersRepository.getUserById(id);
    if (!user) {
      throw new AppError(404, 'User not found', 'User not found');
    }

    // Validate that the resulting balance/allowance won't go negative if subtracting
    if (data.action === 'subtract') {
      const currentValue = Number(user[data.field]);
      if (currentValue - data.amount < 0) {
        throw new AppError(400, 'Invalid operation', `${data.field} cannot be negative`);
      }
    }

    return usersRepository.updateBalance(id, data.field, data.action, data.amount);
  }
}

export const usersService = new UsersService();
