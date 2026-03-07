import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ReportingService } from './reporting.service';
import { NotificationService } from '../notifications/notification.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const reportSchema = z.object({
  departmentId: z.string().uuid().optional(),
  groupId: z.string().uuid().optional(),
});

export const AdminController = {
  async getDepartmentReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { departmentId } = reportSchema.parse(req.query);
      if (!departmentId) return res.status(400).json({ error: 'departmentId is required' });

      const report = await ReportingService.getDepartmentPerformance(departmentId);
      res.status(200).json(report);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async getGlobalROI(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId } = reportSchema.parse(req.query);
      if (!groupId) return res.status(400).json({ error: 'groupId is required' });

      const roi = await ReportingService.getGroupROI(groupId);
      res.status(200).json(roi);
    } catch (error) {
      next(error);
    }
  },

  async getGlobalStats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await ReportingService.getGlobalOverview();
      res.status(200).json(stats);
    } catch (error) {
      next(error);
    }
  },

  async sendSystemNotification(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, title, message, type } = z.object({
        userId: z.string().uuid(),
        title: z.string(),
        message: z.string(),
        type: z.string(),
      }).parse(req.body);

      const notify = await NotificationService.notify(userId, title, message, type);
      res.status(201).json(notify);
    } catch (error) {
      next(error);
    }
  }
};
