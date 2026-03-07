import { prisma } from '../../config/db';

export const ReportingService = {
  /**
   * Gets aggregated health scores for a specific department.
   */
  async getDepartmentPerformance(departmentId: string) {
    const users = await prisma.user.findMany({
      where: { departmentId },
      select: { healthScore: true, currentStreak: true },
    });

    if (users.length === 0) return { avgHealthScore: 0, activeUsers: 0 };

    const totalHealth = users.reduce((sum: number, u: any) => sum + u.healthScore, 0);
    const avgHealthScore = totalHealth / users.length;

    return {
      avgHealthScore: Math.round(avgHealthScore),
      activeUsers: users.length,
      topPerformers: users.filter((u: any) => u.healthScore > 80).length,
    };
  },

  /**
   * Calculates "Time-to-Proficiency" ROI for a specific group.
   * Logic: Average time from enrollment to passing the Proctored Exam.
   */
  async getGroupROI(groupId: string) {
    const users = await prisma.user.findMany({
      where: { groupId },
      include: { 
        proctoringSessions: { 
          where: { status: 'COMPLETED' },
          orderBy: { endTime: 'asc' },
          take: 1
        }
      },
    });

    const completionTimes = users
      .filter((u: any) => u.proctoringSessions.length > 0)
      .map((u: any) => {
        const start = u.createdAt.getTime();
        const end = u.proctoringSessions[0].endTime?.getTime() || start;
        return (end - start) / (1000 * 60 * 60 * 24); // Days
      });

    const avgDaysToProficiency = completionTimes.length > 0 
      ? completionTimes.reduce((a: number, b: number) => a + b, 0) / completionTimes.length
      : 0;

    return {
      avgDaysToProficiency: Math.round(avgDaysToProficiency),
      completionCount: completionTimes.length,
      totalGroupSize: users.length,
    };
  },

  /**
   * Global Global Dashboard for Admin.
   */
  async getGlobalOverview() {
    const [userCount, certCount, totalRevenue] = await Promise.all([
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.certificate.count(),
      prisma.transaction.aggregate({
        _sum: { amount: true },
        where: { status: 'SUCCESS' }
      })
    ]);

    return {
      totalStudents: userCount,
      certificatesIssued: certCount,
      totalRevenue: totalRevenue._sum.amount || 0,
    };
  }
};
