import { prisma } from '../../config/db';
import redis from '../../config/redis';

export const AnalyticsService = {
  /**
   * Updates the user's learning streak.
   */
  async updateStreak(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { lastActivityDate: true, currentStreak: true, longestStreak: true },
    });

    if (!user) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastActivity = user.lastActivityDate
      ? new Date(user.lastActivityDate.getFullYear(), user.lastActivityDate.getMonth(), user.lastActivityDate.getDate())
      : null;

    if (lastActivity && today.getTime() === lastActivity.getTime()) {
      return; // Already active today
    }

    let newStreak = 1;
    if (lastActivity) {
      const diffTime = Math.abs(today.getTime() - lastActivity.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        newStreak = user.currentStreak + 1;
      }
    }

    const newLongestStreak = Math.max(newStreak, user.longestStreak);

    await prisma.user.update({
      where: { id: userId },
      data: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        lastActivityDate: now,
      },
    });
  },

  /**
   * Calculates a composite Learner Health Score (0-100).
   * Weights: 
   * - Video Watch Time (40%)
   * - Checkpoint Quizzes (30%)
   * - IDE Submissions/Integrity (30%)
   */
  async calculateHealthScore(userId: string) {
    const cacheKey = `health_score:${userId}`;
    const cachedScore = await redis.get(cacheKey);

    if (cachedScore) {
      return parseInt(cachedScore, 10);
    }

    // This is a simplified version of the algorithm
    const videoSessions = await prisma.videoSession.findMany({
      where: { studentId: userId },
    });
    
    const checkpoints = await prisma.videoSession.findMany({
      where: { studentId: userId },
      include: { lesson: { include: { checkpoints: true } } }
    });

    const ideSubmissions = await prisma.iDESubmission.findMany({
      where: { studentId: userId },
      include: { flags: true },
    });

    // 1. Video Score (Completion rate)
    const totalVideos = videoSessions.length;
    const completedVideos = videoSessions.filter((s: any) => s.completed).length;
    const videoScore = totalVideos > 0 ? (completedVideos / totalVideos) * 40 : 0;

    // 2. IDE Score (Submissions - Flags)
    const totalIDE = ideSubmissions.length;
    const flaggedIDE = ideSubmissions.filter((s: any) => s.flags.length > 0).length;
    const ideScore = totalIDE > 0 ? ((totalIDE - flaggedIDE) / totalIDE) * 30 : 0;

    // 3. Consistency (Streak baseline)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const streakBonus = user ? Math.min(user.currentStreak * 2, 30) : 0;

    const finalScore = Math.min(Math.round(videoScore + ideScore + streakBonus), 100);

    await prisma.user.update({
      where: { id: userId },
      data: { healthScore: finalScore },
    });

    // Cache for 1 hour
    await redis.set(cacheKey, finalScore, 'EX', 3600);

    return finalScore;
  },
};
