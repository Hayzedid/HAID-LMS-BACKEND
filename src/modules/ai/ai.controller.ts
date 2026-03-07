import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AITutorService } from './tutor.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const chatSchema = z.object({
  lessonId: z.string().uuid(),
  question: z.string().min(5),
});

export const AITutorController = {
  async askTutor(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const { lessonId, question } = chatSchema.parse(req.body);
      
      const response = await AITutorService.getLessonHelp(studentId, lessonId, question);
      
      res.status(200).json(response);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  }
};
