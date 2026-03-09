import { Router } from 'express';
import { GitHubController } from './github.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Student Workspace
/**
 * @swagger
 * /github/link-account:
 *   post:
 *     summary: Link GH account (OAuth link)
 *     tags: [GitHub]
 */
router.post('/link-account', authenticate, GitHubController.linkAccount as any);

/**
 * @swagger
 * /github/link-project:
 *   post:
 *     summary: Link a specific repository
 *     tags: [GitHub]
 */
router.post('/link-project', authenticate, GitHubController.linkProject as any);

/**
 * @swagger
 * /github/sync/{projectId}:
 *   post:
 *     summary: Manually sync latest code
 *     tags: [GitHub]
 */
router.post('/sync/:projectId', authenticate, GitHubController.sync as any);

// Instructor Governance
/**
 * @swagger
 * /github/analyze/{projectId}:
 *   post:
 *     summary: Trigger AI Code Review
 *     tags: [GitHub]
 */
router.post('/analyze/:projectId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), GitHubController.analyze as any);

export const githubRoutes = router;
