import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { IntegrityService } from './integrity.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const keystrokeSchema = z.object({
  submissionId: z.string().uuid(),
  payload: z.array(
    z.object({
      timestamp: z.number(),
      keyName: z.string(),
      cursorPosition: z.number().optional(),
    })
  ).nonempty(),
});

const violationSchema = z.object({
  submissionId: z.string().uuid(),
  type: z.enum(['COPY_PASTE_ATTEMPT', 'AI_SIGNATURE_DETECTED']),
  description: z.string().optional(),
});

export const IntegrityController = {
  async logKeystrokes(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = keystrokeSchema.parse(req.body);
      const session = await IntegrityService.logKeystrokes(parsedData.submissionId, parsedData.payload);
      res.status(201).json({ message: 'Keystrokes logged successfully', session });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      if (error.status === 404) return res.status(404).json({ error: error.message });
      next(error);
    }
  },

  async logViolation(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = violationSchema.parse(req.body);
      const flag = await IntegrityService.logViolation(parsedData.submissionId, parsedData.type, parsedData.description);
      res.status(201).json({ message: 'Violation logged and submission flagged', flag });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
         return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      if (error.status === 404) return res.status(404).json({ error: error.message });
      next(error);
    }
  }
};
