import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

import { authRoutes } from './modules/auth/auth.routes';
import { courseRoutes } from './modules/courses/courses.routes';
import { ideRoutes } from './modules/ide/ide.routes';
import { videoRoutes } from './modules/video/video.routes';
import { assessmentRoutes } from './modules/assessment/assessment.routes';
import { analyticsRoutes } from './modules/analytics/analytics.routes';
import { srsRoutes } from './modules/srs/srs.routes';
import { paymentRoutes } from './modules/payment/payment.routes';
import { certificationRoutes } from './modules/certification/certification.routes';
import { adminRoutes } from './modules/reporting/reporting.routes';
import { aiRoutes } from './modules/ai/ai.routes';
import { organizationRoutes } from './modules/organization/organization.routes';
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger';
import rateLimit from 'express-rate-limit';

const app = express();

// Security Hardening (Phase 6)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(limiter);

// API Documentation (Phase 6)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/ide', ideRoutes);
app.use('/api/v1/video', videoRoutes);
app.use('/api/v1/assessment', assessmentRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/srs', srsRoutes);
app.use('/api/v1/payment', paymentRoutes);
app.use('/api/v1/certification', certificationRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/organization', organizationRoutes);

// Basic Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'TechLearn LMS API is running' });
});

// Generic 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint Not Found' });
});

// Generic Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
});

export default app;
