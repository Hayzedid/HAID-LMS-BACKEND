import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { VideoService } from './video.service';
import { AuthRequest } from '../../middlewares/auth.middleware';
import { prisma } from '../../config/db';

const heartbeatSchema = z.object({
  lessonId: z.string().uuid(),
  watchTimeIncrement: z.number().int().min(1).max(60), // Assuming heartbeats sent every 10-60s
});

const eventSchema = z.object({
  videoSessionId: z.string().uuid(),
  type: z.enum(['TAB_UNFOCUSED', 'PAUSED', 'SEEKED']),
  timestamp: z.number().int().min(0),
});

const checkpointSchema = z.object({
  checkpointId: z.string().uuid(),
  submittedAnswer: z.string().min(1),
});

export const VideoController = {
  async logHeartbeat(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = heartbeatSchema.parse(req.body);
      const studentId = req.user?.userId;

      if (!studentId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const session = await VideoService.logHeartbeat(studentId, parsedData.lessonId, parsedData.watchTimeIncrement);
      res.status(200).json({ message: 'Heartbeat logged', session });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async logEvent(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = eventSchema.parse(req.body);
      const eventLog = await VideoService.logEvent(parsedData.videoSessionId, parsedData.type, parsedData.timestamp);
      
      res.status(201).json({ message: 'Event logged', event: eventLog });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async verifyCheckpoint(req: AuthRequest, res: Response, next: NextFunction) {
     try {
       const parsedData = checkpointSchema.parse(req.body);
       const studentId = req.user?.userId;

       if (!studentId) {
         return res.status(401).json({ error: 'Unauthorized' });
       }

       const isCorrect = await VideoService.verifyCheckpoint(studentId, parsedData.checkpointId, parsedData.submittedAnswer);

       if (isCorrect) {
          res.status(200).json({ message: 'Checkpoint passed', success: true });
       } else {
          res.status(400).json({ message: 'Incorrect answer', success: false });
       }
     } catch (error: any) {
       if (error instanceof z.ZodError) {
         return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
       }
       if (error.status === 404) return res.status(404).json({ error: error.message });
       next(error);
     }
  },

  async getCheckpoints(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lessonId = req.params.lessonId as string;
      const checkpoints = await VideoService.getLessonCheckpoints(lessonId);
      res.status(200).json(checkpoints);
    } catch (error) {
      next(error);
    }
  },

  async getSession(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const lessonId = req.params.lessonId as string;
      const studentId = req.user?.userId;

      const session = await prisma.videoSession.findFirst({
        where: { studentId, lessonId },
      });

      res.status(200).json({ 
        session,
        isFirstWatch: !session || !session.completed 
      });
    } catch (error) {
      next(error);
    }
  }
};
