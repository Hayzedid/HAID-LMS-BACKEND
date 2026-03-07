import { prisma } from '../../config/db';

export const SRSService = {
  /**
   * Schedules or updates a review for a specific lesson.
   * Based on SRS feedback (1-4: Again, Hard, Good, Easy)
   */
  async scheduleReview(studentId: string, lessonId: string, quality: number) {
    const existingReview = await prisma.scheduledReview.findUnique({
      where: { studentId_lessonId: { studentId, lessonId } },
    });

    let interval = 1;
    let easeFactor = 2.5;
    let reviewedCount = 0;

    if (existingReview) {
      reviewedCount = existingReview.reviewedCount + 1;
      easeFactor = Math.max(1.3, existingReview.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

      if (quality < 3) {
        interval = 1; // Start over
      } else if (reviewedCount === 1) {
        interval = 6;
      } else {
        interval = Math.round(existingReview.interval * easeFactor);
      }
    }

    const reviewDate = new Date();
    reviewDate.setDate(reviewDate.getDate() + interval);

    return await prisma.scheduledReview.upsert({
      where: { studentId_lessonId: { studentId, lessonId } },
      update: {
        reviewDate,
        interval,
        easeFactor,
        reviewedCount,
      },
      create: {
        studentId,
        lessonId,
        reviewDate,
        interval,
        easeFactor,
      },
    });
  },

  /**
   * Gets all reviews due for a student today.
   */
  async getDueReviews(studentId: string) {
    const now = new Date();
    return await prisma.scheduledReview.findMany({
      where: {
        studentId,
        reviewDate: { lte: now },
      },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    });
  },
};
