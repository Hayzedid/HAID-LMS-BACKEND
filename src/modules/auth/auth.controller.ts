import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthService } from './auth.service';

const registerSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN', 'HR_MANAGER']).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const AuthController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = registerSchema.parse(req.body);
      const user = await AuthService.registerUser(parsedData);
      res.status(201).json({ message: 'User registered successfully', user });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const parsedData = loginSchema.parse(req.body);
      const authData = await AuthService.loginUser(parsedData);
      res.status(200).json(authData);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Validation failed', details: error.flatten().fieldErrors });
      }
      next(error);
    }
  },
};
