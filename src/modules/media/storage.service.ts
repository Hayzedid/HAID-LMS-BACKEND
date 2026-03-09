import fs from 'fs';
import path from 'path';

export const StorageService = {
  /**
   * Saves a file to the local uploads directory.
   * Returns the relative URL for the stored file.
   */
  async saveFile(file: Express.Multer.File, subDir: 'audio' | 'attachments'): Promise<string> {
    const uploadDir = path.join(process.cwd(), 'uploads', subDir);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.originalname.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file
    fs.writeFileSync(filePath, file.buffer);

    // Return the relative URL (assuming /uploads is served statically)
    return `/uploads/${subDir}/${fileName}`;
  }
};
