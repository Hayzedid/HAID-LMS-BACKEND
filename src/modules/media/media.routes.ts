import { Router } from 'express';
import multer from 'multer';
import { MediaController } from './media.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * @swagger
 * /media/upload/audio:
 *   post:
 *     summary: Upload an audio file for a lesson
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
router.post(
  '/upload/audio', 
  authenticate, 
  authorize(['INSTRUCTOR', 'ADMIN']), 
  upload.single('file'), 
  MediaController.uploadAudio as any
);

/**
 * @swagger
 * /media/upload/attachment:
 *   post:
 *     summary: Upload a supplemental attachment for a lesson
 *     tags: [Media]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 */
router.post(
  '/upload/attachment', 
  authenticate, 
  authorize(['INSTRUCTOR', 'ADMIN']), 
  upload.single('file'), 
  MediaController.uploadAttachment as any
);

export const mediaRoutes = router;
