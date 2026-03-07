import { prisma } from '../../config/db';

export const NotificationService = {
  /**
   * Sends a notification to a user.
   */
  async notify(userId: string, title: string, message: string, type: string) {
    const notification = await prisma.notification.create({
      data: { userId, title, message, type },
    });

    // In a real scenario, this would trigger an email/push via a provider
    // e.g., EmailService.sendEmail(user.email, title, message);
    
    return notification;
  },

  /**
   * Gets unread notifications for a user.
   */
  async getNotifications(userId: string) {
    return await prisma.notification.findMany({
      where: { userId, read: false },
      orderBy: { createdAt: 'desc' },
    });
  },

  /**
   * Marks a notification as read.
   */
  async markAsRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { read: true },
    });
  },

  /**
   * Bulk marks all notifications for a user as read.
   */
  async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
  }
};
