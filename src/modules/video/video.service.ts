import { prisma } from '../../config/db';
import { ProgressService } from '../course/progress.service';

export class VideoService {
  static async logHeartbeat(studentId: string, lessonId: string, watchTimeIncrement: number) {
    let session = await prisma.videoSession.findFirst({
      where: { studentId, lessonId },
    });

    if (!session) {
      session = await prisma.videoSession.create({
        data: {
          studentId,
          lessonId,
          accumulatedWatchTime: watchTimeIncrement,
        },
      });
    } else {
      session = await prisma.videoSession.update({
        where: { id: session.id },
        data: {
          accumulatedWatchTime: {
            increment: watchTimeIncrement,
          },
        },
      });
    }

    return session;
  }

  static async logEvent(videoSessionId: string, type: string, timestamp: number) {
    return await prisma.videoEvent.create({
      data: {
        videoSessionId,
        type,
        timestamp,
      },
    });
  }

  static async getLessonCheckpoints(lessonId: string) {
    return await prisma.checkpointQuiz.findMany({
      where: { lessonId },
      orderBy: { timestamp: 'asc' },
    });
  }

  static async verifyCheckpoint(studentId: string, checkpointId: string, submittedAnswer: string) {
    const checkpoint = await prisma.checkpointQuiz.findUnique({
      where: { id: checkpointId },
    });

    if (!checkpoint) {
      throw { status: 404, message: 'Checkpoint not found' };
    }

    // In a real system, we'd log this attempt to an Attempt table.
    // For now, simple boolean return.
    const isCorrect = checkpoint.answer.toLowerCase() === submittedAnswer.toLowerCase();

    if (isCorrect) {
      // Logic: If this was the last checkpoint in the video, mark the lesson as completed
      const allCheckpoints = await this.getLessonCheckpoints(checkpoint.lessonId);
      const isLast = allCheckpoints[allCheckpoints.length - 1].id === checkpointId;
      
      if (isLast) {
        await ProgressService.markAsCompleted(studentId, checkpoint.lessonId);
      }
    }

    return isCorrect;
  }
}
