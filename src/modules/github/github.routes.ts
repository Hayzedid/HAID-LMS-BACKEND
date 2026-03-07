import { Router } from 'express';
import { GitHubController } from './github.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

// Student Workspace
router.post('/link-account', authenticate, GitHubController.linkAccount as any);
router.post('/link-project', authenticate, GitHubController.linkProject as any);
router.post('/sync/:projectId', authenticate, GitHubController.sync as any);

// Instructor Governance
router.post('/analyze/:projectId', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), GitHubController.analyze as any);

export const githubRoutes = router;
