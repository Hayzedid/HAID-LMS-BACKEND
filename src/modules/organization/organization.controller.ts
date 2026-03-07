import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { OrganizationService } from './organization.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const orgSchema = z.object({
  name: z.string(),
  slug: z.string(),
  logoUrl: z.string().url().optional(),
  themeConfig: z.any().optional(),
});

export const OrganizationController = {
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const parsedData = orgSchema.parse(req.body);
      const org = await OrganizationService.createOrganization(parsedData);
      res.status(201).json(org);
    } catch (error) {
      next(error);
    }
  },

  async getBranding(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;
      const org = await OrganizationService.getBySlug(slug as string);
      if (!org) return res.status(404).json({ error: 'Organization not found' });
      res.status(200).json(org);
    } catch (error) {
      next(error);
    }
  }
};
