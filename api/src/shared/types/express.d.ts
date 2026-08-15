import { Role } from '../constants/roles';

declare global {
  namespace Express {
    interface Request {
      user?: {
        sub: string;
        email: string;
        role: Role;
        name: string;
      };
      pagination?: {
        page: number;
        limit: number;
      };
    }
  }
}
