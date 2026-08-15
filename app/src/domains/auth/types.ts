export type Role = 'ADMIN' | 'USER';

export interface User {
  id: string;
  supabaseUserId: string;
  name: string;
  role: Role;
  hasCompletedTutorial: boolean;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}
