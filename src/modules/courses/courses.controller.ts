import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { CourseService } from './courses.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const createCourseSchema = z.object({
  title: z.string().min(5),
  description: z.string().min(10),
  level: z.enum(['Beginner', 'Intermediate', 'Advanced']),
});

const createModuleSchema = z.object({
  title: z.string().min(3),
  order: z.number().int().min(1),
  courseId: z.string().uuid(),
});

const createLessonSchema = z.object({
  title: z.string().min(3),
  type: z.enum(['VIDEO', 'TEXT', 'CODE']),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  order: z.number().int().min(1),
  moduleId: z.string().uuid(),
});

export const CourseController = {
  async createCourse(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = createCourseSchema.parse(req.body);
      const instructorId = req.user?.userId;

      if (!instructorId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const course = await CourseService.createCourse({ ...parsedData, instructorId });
      res.status(201).json({ message: 'Course created successfully', course });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async getAllCourses(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const courses = await CourseService.getAllCourses();
      res.status(200).json(courses);
    } catch (error) {
      next(error);
    }
  },

  async getCourseById(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.id;
      if (!courseId || typeof courseId !== 'string') {
        return res.status(400).json({ error: 'Invalid course ID' });
      }
      const course = await CourseService.getCourseById(courseId);
      res.status(200).json(course);
    } catch (error: any) {
      if (error.status === 404) return res.status(404).json({ error: error.message });
      next(error);
    }
  },

  async createModule(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = createModuleSchema.parse(req.body);
      const newModule = await CourseService.createModule(parsedData);
      res.status(201).json({ message: 'Module created successfully', module: newModule });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async createLesson(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = createLessonSchema.parse(req.body);
      
      // Basic validation based on type
      if (parsedData.type === 'VIDEO' && !parsedData.videoUrl) {
         return res.status(400).json({ error: 'videoUrl is required for VIDEO lessons' });
      }
      if (parsedData.type !== 'VIDEO' && !parsedData.content) {
         return res.status(400).json({ error: 'content is required for TEXT and CODE lessons' });
      }

      const lesson = await CourseService.createLesson(parsedData);
      res.status(201).json({ message: 'Lesson created successfully', lesson });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  }
};
