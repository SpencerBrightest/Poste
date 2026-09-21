import { NotificationType } from "@prisma/client";

export interface EmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailProvider {
  /**
   * Send an email
   */
  send(params: EmailParams): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

export interface NotificationParams {
  userId: string;
  organizationId?: string;
  type: NotificationType;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  sendEmail?: boolean;
}

export interface NotificationService {
  /**
   * Create and send a notification
   */
  create(params: NotificationParams): Promise<void>;

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: string): Promise<void>;

  /**
   * Mark all notifications as read for a user
   */
  markAllAsRead(userId: string): Promise<void>;

  /**
   * Get notifications for a user
   */
  getUserNotifications(userId: string, limit?: number): Promise<unknown[]>;
}
