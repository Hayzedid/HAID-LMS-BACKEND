import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { EnterpriseService } from './enterprise.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const createPathSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
});

const addCourseSchema = z.object({
  courseId: z.string().uuid(),
  order: z.number().int(),
});

const assignUserSchema = z.object({
  userId: z.string().uuid(),
  learningPathId: z.string().uuid(),
  deadline: z.string().datetime().optional(),
});

const assignGroupSchema = z.object({
  groupId: z.string().uuid(),
  learningPathId: z.string().uuid(),
  deadline: z.string().datetime().optional(),
});

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'HR_MANAGER']),
});

export const EnterpriseController = {
  async createLearningPath(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.organizationId; // Assuming organizationId is in JWT
      if (!orgId) return res.status(403).json({ error: 'User is not associated with an organization' });

      const { name, description } = createPathSchema.parse(req.body);
      const path = await EnterpriseService.createLearningPath(name, orgId, description);
      res.status(201).json(path);
    } catch (error) {
      next(error);
    }
  },

  async addCourseToPath(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const { courseId, order } = addCourseSchema.parse(req.body);
      const link = await EnterpriseService.addCourseToPath(id, courseId, order);
      res.status(201).json(link);
    } catch (error) {
      next(error);
    }
  },

  async assignToUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { userId, learningPathId, deadline } = assignUserSchema.parse(req.body);
      const assignment = await EnterpriseService.assignPathToUser(
        userId, 
        learningPathId, 
        deadline ? new Date(deadline) : undefined
      );
      res.status(201).json(assignment);
    } catch (error) {
      next(error);
    }
  },

  async assignToGroup(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { groupId, learningPathId, deadline } = assignGroupSchema.parse(req.body);
      const result = await EnterpriseService.assignPathToGroup(
        groupId, 
        learningPathId, 
        deadline ? new Date(deadline) : undefined
      );
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  async inviteUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const orgId = req.user?.organizationId;
      const invitedById = req.user?.userId;
      if (!orgId || !invitedById) return res.status(403).json({ error: 'Permissions denied' });

      const { email, role } = inviteSchema.parse(req.body);
      const invite = await EnterpriseService.inviteUser(orgId, email, role, invitedById);
      res.status(201).json({ message: 'Invite created', token: invite.token });
    } catch (error) {
      next(error);
    }
  },

  async acceptInvite(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { token } = z.object({ token: z.string() }).parse(req.body);
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const result = await EnterpriseService.acceptInvite(token, userId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  async exportGDPR(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      const data = await EnterpriseService.exportUserData(userId);
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async deleteAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const userId = req.user?.userId;
      if (!userId) return res.status(401).json({ error: 'Unauthorized' });

      await EnterpriseService.deleteUserAccount(userId);
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
};
