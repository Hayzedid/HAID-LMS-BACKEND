import { prisma } from '../../config/db';

export class IntegrityService {
  /**
   * Logs a batch of keystrokes associated with a specific code submission.
   */
  static async logKeystrokes(submissionId: string, payload: any[]) {
    // Basic validation to ensure the submission exists
    const submission = await prisma.iDESubmission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      throw { status: 404, message: 'Submission not found' };
    }

    return await prisma.keystrokeSession.create({
      data: {
        submissionId,
        payload: JSON.stringify(payload), // Storing the structured JSON array as text
      },
    });
  }

  /**
   * Logs an explicit integrity violation (e.g., pasting code, AI signature match).
   */
  static async logViolation(submissionId: string, type: string, description?: string) {
    const submission = await prisma.iDESubmission.findUnique({
      where: { id: submissionId }
    });

    if (!submission) {
      throw { status: 404, message: 'Submission not found' };
    }

    // Creating the flag
    const flag = await prisma.integrityFlag.create({
       data: {
         submissionId,
         type,
         description
       }
    });

    // We also mark the submission itself as FLAGGED
    await prisma.iDESubmission.update({
       where: { id: submissionId },
       data: { status: 'FLAGGED' }
    });

    return flag;
  }
}
