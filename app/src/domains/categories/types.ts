export type CategoryVisibility = 'ALL' | 'ADMIN_ONLY' | 'USER_ONLY';

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  visibility: CategoryVisibility;
  isActive: boolean;
  createdById: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryPayload {
  name: string;
  icon?: string | null;
  color?: string | null;
  visibility?: CategoryVisibility;
}

export interface UpdateCategoryPayload {
  name?: string;
  icon?: string | null;
  color?: string | null;
  visibility?: CategoryVisibility;
  isActive?: boolean;
}
