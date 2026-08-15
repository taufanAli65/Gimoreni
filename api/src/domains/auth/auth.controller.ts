import { Request, Response, NextFunction } from 'express';
import { authService } from './auth.service';
import { LoginDto } from './auth.dto';
import { success, error } from '../../shared/utils/response.util';
import { AppError } from '../../shared/utils/AppError';
import { env } from '../../config/env';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedBody = LoginDto.safeParse(req.body);
      if (!parsedBody.success) {
        throw new AppError(400, 'Invalid input', parsedBody.error.message);
      }

      const { accessToken, refreshToken, user } = await authService.login(parsedBody.data);

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json(success({ accessToken, user }));
    } catch (err) {
      next(err);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.cookies;
      if (!refreshToken) {
        throw new AppError(401, 'Refresh token missing', 'Refresh token missing');
      }

      const { accessToken } = await authService.refresh(refreshToken);

      res.json(success({ accessToken }));
    } catch (err) {
      next(err);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
      });

      res.json(success({ message: 'Logged out successfully' }));
    } catch (err) {
      next(err);
    }
  }

  async me(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new AppError(401, 'Not authenticated', 'Not authenticated');
      }

      const user = await authService.me(req.user.sub);
      res.json(success(user));
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
