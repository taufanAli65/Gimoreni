export const Role = {
  ADMIN: 'ADMIN',
  USER: 'USER',
} as const;

export type Role = keyof typeof Role;
