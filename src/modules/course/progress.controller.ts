import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { ProgressService } from './progress.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const ProgressController = {
  async getStatus(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      const { courseId } = z.object({ courseId: z.string().uuid() }).parse(req.params);

      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const progress = await ProgressService.getCourseProgress(studentId, courseId);
      const nextLesson = await ProgressService.getNextLesson(studentId, courseId);

      res.status(200).json({
        progressPercentage: progress,
        nextLessonId: nextLesson?.id || null,
        nextLessonTitle: nextLesson?.title || null,
      });
    } catch (error) {
      next(error);
    }
  },

  async markComplete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      const { lessonId } = z.object({ lessonId: z.string().uuid() }).parse(req.body);

      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const completion = await ProgressService.markAsCompleted(studentId, lessonId);
      res.status(200).json(completion);
    } catch (error) {
      next(error);
    }
  }
};
