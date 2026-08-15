import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../../config/env';
import { supabase } from '../../config/supabase';
import { authRepository } from './auth.repository';
import { LoginDtoType } from './auth.dto';
import { AppError } from '../../shared/utils/AppError';

export class AuthService {
  async login(data: LoginDtoType) {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error || !authData.user) {
      throw new AppError(401, 'Invalid email or password', error?.message || 'Invalid email or password');
    }

    const user = await authRepository.getUserByEmail(data.email);

    if (!user || !user.isActive) {
      throw new AppError(401, 'User not found or inactive', 'User not found or inactive');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };

    const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
      expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'],
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        hasCompletedTutorial: user.hasCompletedTutorial,
      },
    };
  }

  async refresh(token: string) {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as any;
      const user = await authRepository.getUserById(decoded.sub);

      if (!user || !user.isActive) {
        throw new AppError(401, 'User not found or inactive', 'User not found or inactive');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
      };

      const accessToken = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
        expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'],
      });

      return { accessToken };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid or expired refresh token';
      throw new AppError(401, 'Invalid or expired refresh token', errorMessage);
    }
  }

  async me(userId: string) {
    const user = await authRepository.getUserById(userId);

    if (!user || !user.isActive) {
      throw new AppError(401, 'User not found or inactive', 'User not found or inactive');
    }

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      hasCompletedTutorial: user.hasCompletedTutorial,
    };
  }
}

export const authService = new AuthService();
