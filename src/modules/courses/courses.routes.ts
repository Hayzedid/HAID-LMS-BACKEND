import { Router } from 'express';
import { CourseController } from './courses.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { enforcePrerequisites } from '../../middlewares/prerequisite.middleware';

const router = Router();

router.get('/', authenticate, CourseController.getAllCourses as any);
router.get('/:id', authenticate, CourseController.getCourseById as any);
router.get('/lesson/:lessonId', authenticate, enforcePrerequisites, CourseController.getLessonById as any);

router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CourseController.createCourse as any);
router.post('/module', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CourseController.createModule as any);
router.post('/lesson', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CourseController.createLesson as any);

export const courseRoutes = router;
