import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { CertificationService } from './certification.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const issueSchema = z.object({
  studentId: z.string().uuid(),
  courseId: z.string().uuid(),
});

export const CertificationController = {
  async listCertificates(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const certs = await CertificationService.getStudentCertificates(studentId);
      res.status(200).json(certs);
    } catch (error) {
      next(error);
    }
  },

  async issue(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { studentId, courseId } = issueSchema.parse(req.body);
      const cert = await CertificationService.issueCertificate(studentId, courseId);
      res.status(201).json({ message: 'Certificate issued', cert });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      res.status(400).json({ error: error.message });
    }
  },
};
