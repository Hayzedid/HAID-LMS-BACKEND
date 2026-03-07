import { Response, NextFunction } from 'express';
import { z } from 'zod';
import { GitHubService } from './github.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

const linkAccountSchema = z.object({
  githubUsername: z.string(),
  accessToken: z.string(),
});

const linkProjectSchema = z.object({
  courseId: z.string().uuid(),
  repoUrl: z.string().url(),
  branch: z.string().optional(),
});

export const GitHubController = {
  async linkAccount(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const { githubUsername, accessToken } = linkAccountSchema.parse(req.body);
      const integration = await GitHubService.linkAccount(studentId, githubUsername, accessToken);
      
      res.status(200).json(integration);
    } catch (error) {
      next(error);
    }
  },

  async linkProject(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const studentId = req.user?.userId;
      if (!studentId) return res.status(401).json({ error: 'Unauthorized' });

      const { courseId, repoUrl, branch } = linkProjectSchema.parse(req.body);
      const project = await GitHubService.linkProject(studentId, courseId, repoUrl, branch);
      
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  },

  async sync(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);
      const data = await GitHubService.syncProject(projectId);
      
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  },

  async analyze(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { projectId } = z.object({ projectId: z.string().uuid() }).parse(req.params);
      const analysis = await GitHubService.analyzeIntegrity(projectId);
      
      res.status(200).json(analysis);
    } catch (error) {
      next(error);
    }
  }
};
