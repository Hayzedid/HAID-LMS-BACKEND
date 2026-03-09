import { Router } from 'express';
import { OrganizationController } from './organization.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /organization:
 *   post:
 *     summary: Create a new B2B Organization
 *     tags: [Organization]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, slug]
 *             properties:
 *               name: { type: string }
 *               slug: { type: string }
 *               logoUrl: { type: string, format: uri }
 *               themeConfig: { type: object }
 *     responses:
 *       201:
 *         description: Organization created successfully
 */
router.post('/', authenticate, authorize(['ADMIN']), OrganizationController.create as any);

/**
 * @swagger
 * /organization/{slug}/branding:
 *   get:
 *     summary: Retrieve organization-specific branding and configuration
 *     tags: [Organization]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Organization branding data
 */
router.get('/:slug/branding', OrganizationController.getBranding as any);

export const organizationRoutes = router;
