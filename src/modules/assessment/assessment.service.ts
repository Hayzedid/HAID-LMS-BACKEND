import { prisma } from '../../config/db';

export const AssessmentService = {
  async createExam(data: {
    title: string;
    description?: string;
    durationMinutes: number;
    passingScore: number;
    lessonId: string;
  }) {
    return await prisma.proctoredExam.create({
      data,
    });
  },

  async startProctoringSession(studentId: string, examId: string) {
    return await prisma.proctoringSession.create({
      data: {
        studentId,
        examId,
        status: 'STARTED',
        webcamEnabled: true,
        screenSharing: true,
        identityVerified: false, // Initial state, verified via frontend/AI
      },
    });
  },

  async updateProctoringStatus(sessionId: string, status: string, riskScore?: number) {
    return await prisma.proctoringSession.update({
      where: { id: sessionId },
      data: {
        status,
        ...(riskScore !== undefined && { riskScore }),
        ...(status === 'COMPLETED' || status === 'TERMINATED' ? { endTime: new Date() } : {}),
      },
    });
  },

  async logProctoringViolation(sessionId: string, type: string, description?: string) {
    return await prisma.integrityFlag.create({
      data: {
        proctoringSessionId: sessionId,
        type,
        description,
      },
    });
  },

  async getSessionIntegrityReport(sessionId: string) {
    return await prisma.proctoringSession.findUnique({
      where: { id: sessionId },
      include: {
        flags: true,
        student: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        exam: true,
      },
    });
  },
};
