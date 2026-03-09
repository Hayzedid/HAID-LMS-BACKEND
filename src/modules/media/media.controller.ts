import { Response, NextFunction } from 'express';
import { StorageService } from './storage.service';
import { AuthRequest } from '../../middlewares/auth.middleware';

export const MediaController = {
  async uploadAudio(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No audio file provided' });
      }

      const fileUrl = await StorageService.saveFile(req.file, 'audio');
      res.status(201).json({ 
        message: 'Audio uploaded successfully', 
        url: fileUrl 
      });
    } catch (error) {
      next(error);
    }
  },

  async uploadAttachment(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No attachment file provided' });
      }

      const fileUrl = await StorageService.saveFile(req.file, 'attachments');
      res.status(201).json({ 
        message: 'Attachment uploaded successfully', 
        url: fileUrl 
      });
    } catch (error) {
      next(error);
    }
  }
};
