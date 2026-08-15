import { prisma } from '../../config/prisma';

export class AuthRepository {
  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async getUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  }
}

export const authRepository = new AuthRepository();
