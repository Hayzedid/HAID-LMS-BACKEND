import { Router } from 'express';
import { CourseController } from './courses.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';
import { enforcePrerequisites } from '../../middlewares/prerequisite.middleware';

const router = Router();

/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 */
router.get('/', authenticate, CourseController.getAllCourses as any);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course details with modules and lessons
 */
router.get('/:id', authenticate, CourseController.getCourseById as any);

/**
 * @swagger
 * /courses/lesson/{lessonId}:
 *   get:
 *     summary: Get lesson by ID (Secured by Prerequisites)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: lessonId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lesson content
 *       403:
 *         description: Prerequisites not met
 */
router.get('/lesson/:lessonId', authenticate, enforcePrerequisites, CourseController.getLessonById as any);

/**
 * @swagger
 * /courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Course created
 */
router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CourseController.createCourse as any);
/**
 * @swagger
 * /courses/module:
 *   post:
 *     summary: Create a new module in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, order, courseId]
 *             properties:
 *               title: { type: string }
 *               order: { type: number }
 *               courseId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Module created
 */
router.post('/module', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CourseController.createModule as any);

/**
 * @swagger
 * /courses/lesson:
 *   post:
 *     summary: Create a new lesson in a module
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, type, order, moduleId]
 *             properties:
 *               title: { type: string }
 *               type: { type: string, enum: [VIDEO, TEXT, CODE] }
 *               order: { type: number }
 *               moduleId: { type: string, format: uuid }
 *               content: { type: string }
 *               videoUrl: { type: string, format: uri }
 *     responses:
 *       201:
 *         description: Lesson created
 */
router.post('/lesson', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CourseController.createLesson as any);

export const courseRoutes = router;
