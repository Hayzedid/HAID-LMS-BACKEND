import { Router } from 'express';
import { IDEController } from './ide.controller';
import { IntegrityController } from './integrity.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { enforcePrerequisites } from '../../middlewares/prerequisite.middleware';

const router = Router();

router.post('/submit', authenticate, enforcePrerequisites, IDEController.submitCode as any);
router.post('/upload-viva', authenticate, enforcePrerequisites, IDEController.uploadViva as any);

// IDE Integrity extensions
router.post('/keystrokes', authenticate, enforcePrerequisites, IntegrityController.logKeystrokes as any);
router.post('/violation', authenticate, enforcePrerequisites, IntegrityController.logViolation as any);

export const ideRoutes = router;
