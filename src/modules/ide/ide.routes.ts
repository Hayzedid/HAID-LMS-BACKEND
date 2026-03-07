import { Router } from 'express';
import { IDEController } from './ide.controller';
import { IntegrityController } from './integrity.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/submit', authenticate, IDEController.submitCode as any);
router.post('/upload-viva', authenticate, IDEController.uploadViva as any);

// IDE Integrity extensions
router.post('/keystrokes', authenticate, IntegrityController.logKeystrokes as any);
router.post('/violation', authenticate, IntegrityController.logViolation as any);

export const ideRoutes = router;
