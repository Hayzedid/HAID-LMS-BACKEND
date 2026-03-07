import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../../config/db';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { AIAnalysisService } from './ai_analysis.service';
import { AnalyticsService } from '../analytics/analytics.service';

const submitCodeSchema = z.object({
  language: z.string(),
  code: z.string().min(1),
  lessonId: z.string().uuid(),
});

const vivaUploadSchema = z.object({
  submissionId: z.string().uuid(),
  vivaUrl: z.string().url(),
});

export const IDEController = {
  async submitCode(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = submitCodeSchema.parse(req.body);
      const studentId = req.user?.userId;

      if (!studentId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // 1. Save submission
      const submission = await prisma.iDESubmission.create({
        data: {
           ...parsedData,
           studentId,
           status: 'PENDING'
        }
      });

      // 2. Trigger AI Analysis (Async)
      AIAnalysisService.detectAISignature(submission.id, parsedData.code).catch(console.error);
      AIAnalysisService.runPlagiarismCheck(submission.id, parsedData.code).catch(console.error);

      // 3. Update Streak (Phase 4)
      AnalyticsService.updateStreak(studentId).catch(console.error);

      res.status(201).json({
        message: 'Code submitted successfully. Analysis in progress.',
        submissionId: submission.id,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async uploadViva(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { submissionId, vivaUrl } = vivaUploadSchema.parse(req.body);
      
      const updatedSubmission = await prisma.iDESubmission.update({
        where: { id: submissionId },
        data: { vivaUrl },
      });

      res.status(200).json({ message: 'Viva video linked successfully', submission: updatedSubmission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  }
};
