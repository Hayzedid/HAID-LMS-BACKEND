import { Router } from 'express';
import { OrganizationController } from './organization.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, authorize(['ADMIN']), OrganizationController.create as any);
router.get('/:slug', OrganizationController.getBranding as any); // Publicly accessible to retrieve logos/themes

export const organizationRoutes = router;
