import { prisma } from '../../config/db';
import crypto from 'crypto';

export const EnterpriseService = {
  // --- Learning Paths ---
  async createLearningPath(name: string, organizationId: string, description?: string) {
    return await prisma.learningPath.create({
      data: { name, organizationId, description },
    });
  },

  async addCourseToPath(learningPathId: string, courseId: string, order: number) {
    return await prisma.learningPathCourse.create({
      data: { learningPathId, courseId, order },
    });
  },

  async assignPathToUser(userId: string, learningPathId: string, deadline?: Date) {
    return await prisma.learningPathAssignment.create({
      data: { userId, learningPathId, deadline },
    });
  },

  async assignPathToGroup(groupId: string, learningPathId: string, deadline?: Date) {
    const group = await prisma.group.findUnique({
      where: { id: groupId },
      include: { users: true },
    });
    if (!group) throw new Error('Group not found');

    const assignments = group.users.map((user: { id: string }) => ({
      userId: user.id,
      learningPathId,
      deadline,
    }));

    return await prisma.learningPathAssignment.createMany({
      data: assignments,
      skipDuplicates: true,
    });
  },

  // --- Seat & Invite Management ---
  async inviteUser(organizationId: string, email: string, role: string, invitedById: string) {
    const org = await prisma.organization.findUnique({ where: { id: organizationId } });
    if (!org) throw new Error('Organization not found');

    if (org.usedSeats >= org.seatLimit) {
      throw new Error('Seat limit reached for this organization');
    }

    const token = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    return await prisma.userInvite.create({
      data: {
        email,
        organizationId,
        role: role as any,
        invitedById,
        token,
        expiresAt,
      },
    });
  },

  async acceptInvite(token: string, userId: string) {
    const invite = await prisma.userInvite.findUnique({ where: { token } });
    if (!invite || invite.status !== 'PENDING' || invite.expiresAt < new Date()) {
      throw new Error('Invalid or expired invite');
    }

    return await prisma.$transaction(async (tx: any) => {
      await tx.user.update({
        where: { id: userId },
        data: { role: invite.role, organizationId: invite.organizationId },
      });

      await tx.userInvite.update({
        where: { id: invite.id },
        data: { status: 'ACCEPTED', acceptedUserId: userId },
      });

      await tx.organization.update({
        where: { id: invite.organizationId },
        data: { usedSeats: { increment: 1 } },
      });

      return { success: true };
    });
  },

  // --- GDPR Compliance ---
  async exportUserData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        certificates: true,
        learningPaths: { include: { learningPath: true } },
        externalProjects: true,
        transactions: true,
        notifications: true,
      },
    });

    if (!user) throw new Error('User not found');

    // Data Sanitization
    const { password, ...safeData } = user;
    return safeData;
  },

  async deleteUserAccount(userId: string) {
    // Note: This permanently deletes the user and cascade-deletes relations defined in schema
    return await prisma.user.delete({ where: { id: userId } });
  }
};
