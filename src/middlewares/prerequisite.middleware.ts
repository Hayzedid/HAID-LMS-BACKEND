import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { ProgressService } from '../modules/course/progress.service';

/**
 * Middleware to enforce sequential learning.
 * Verifies if the authenticated student has completed all preceding lessons.
 */
export const enforcePrerequisites = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const studentId = req.user?.userId;
    const lessonId = req.params.lessonId || req.body.lessonId;

    if (!studentId || !lessonId) {
      return next(); // Skip if no user or lesson ID context
    }

    // Role-based bypass: Instructors, Admins, and HR Managers can see anything
    if (req.user?.role !== 'STUDENT') {
      return next();
    }

    const eligible = await ProgressService.canAccessLesson(studentId, lessonId);

    if (!eligible) {
      return res.status(403).json({
        error: 'Sequential learning enforced',
        message: 'Please complete all previous lessons and assessments before proceeding to this content.',
      });
    }

    next();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error while checking prerequisites' });
  }
};
