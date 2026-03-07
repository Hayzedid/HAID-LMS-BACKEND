import { Response, NextFunction } from 'express';
import { AnalyticsService } from './analytics.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const AnalyticsController = {
  async getStreak(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      // Update streak on visit
      await AnalyticsService.updateStreak(userId);
      res.status(200).json({ message: 'Streak updated' });
    } catch (error) {
      next(error);
    }
  },

  async getHealthScore(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const score = await AnalyticsService.calculateHealthScore(userId);
      res.status(200).json({ healthScore: score });
    } catch (error) {
      next(error);
    }
  },
};
