import { Router } from 'express';
import { CertificationController } from './certification.controller';
import { authenticate, authorize } from '../../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, CertificationController.listCertificates as any);
router.post('/issue', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), CertificationController.issue as any);

export const certificationRoutes = router;
