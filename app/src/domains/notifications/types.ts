export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  isRead: boolean;
  actionUrl: string | null;
  requiresAction: boolean;
  createdAt: string;
}

export interface NotificationsResponse {
  items: Notification[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
