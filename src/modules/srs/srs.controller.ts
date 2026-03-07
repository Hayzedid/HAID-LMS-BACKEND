import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { SRSService } from './srs.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const feedbackSchema = z.object({
  lessonId: z.string().uuid(),
  quality: z.number().int().min(1).max(5), // 1: Again, 5: Easy
});

export const SRSController = {
  async getDueReviews(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const due = await SRSService.getDueReviews(studentId);
      res.status(200).json(due);
    } catch (error) {
      next(error);
    }
  },

  async submitFeedback(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const { lessonId, quality } = feedbackSchema.parse(req.body);
      const review = await SRSService.scheduleReview(studentId, lessonId, quality);
      
      res.status(200).json({ message: 'Review feedback processed', nextReview: review.reviewDate });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },
};
