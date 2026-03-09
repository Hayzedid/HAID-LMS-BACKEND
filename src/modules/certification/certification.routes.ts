import { Router } from 'express';
import { CertificationController } from './certification.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /certification:
 *   get:
 *     summary: Get all certificates for the current student
 *     tags: [Certification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of certificates
 */
router.get('/', authenticate, CertificationController.listCertificates as any);

/**
 * @swagger
 * /certification/issue:
 *   post:
 *     summary: Issue a new certificate
 *     tags: [Certification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [studentId, courseId]
 *             properties:
 *               studentId: { type: string, format: uuid }
 *               courseId: { type: string, format: uuid }
 *     responses:
 *       201:
 *         description: Certificate issued successfully
 */
router.post('/issue', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CertificationController.issue as any);

export const certificationRoutes = router;
