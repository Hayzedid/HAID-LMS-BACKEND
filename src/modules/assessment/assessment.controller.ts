import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { AssessmentService } from './assessment.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const examSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  durationMinutes: z.number().int().positive(),
  passingScore: z.number().int().min(0).max(100),
  lessonId: z.string().uuid(),
});

const sessionSchema = z.object({
  examId: z.string().uuid(),
});

const updateSessionSchema = z.object({
  status: z.enum(['STARTED', 'COMPLETED', 'FLAGGED', 'TERMINATED']),
  riskScore: z.number().int().min(0).max(100).optional(),
});

const violationSchema = z.object({
  sessionId: z.string().uuid(),
  type: z.string().min(1),
  description: z.string().optional(),
});

export const AssessmentController = {
  async createExam(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = examSchema.parse(req.body);
      const exam = await AssessmentService.createExam(parsedData);
      res.status(201).json({ message: 'Proctored exam created', exam });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async startSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      const { examId } = sessionSchema.parse(req.body);

      if (!studentId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const session = await AssessmentService.startProctoringSession(studentId, examId);
      res.status(201).json({ message: 'Proctoring session started', session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async updateSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const { status, riskScore } = updateSessionSchema.parse(req.body);

      const session = await AssessmentService.updateProctoringStatus(sessionId, status, riskScore);
      res.status(200).json({ message: 'Proctoring status updated', session });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async logViolation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = violationSchema.parse(req.body);
      const flag = await AssessmentService.logProctoringViolation(
        parsedData.sessionId, 
        parsedData.type, 
        parsedData.description
      );
      res.status(201).json({ message: 'Violation logged', flag });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async getReport(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const sessionId = req.params.sessionId as string;
      const report = await AssessmentService.getSessionIntegrityReport(sessionId);

      if (!report) {
         return res.status(404).json({ error: 'Session report not found' });
      }
      
      res.status(200).json(report);
    } catch (error) {
      next(error);
    }
  },
};
