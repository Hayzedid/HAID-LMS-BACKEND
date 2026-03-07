import { prisma } from '../../config/db';

export const OrganizationService = {
  /**
   * Creates a new B2B Organization.
   */
  async createOrganization(data: { name: string; slug: string; logoUrl?: string; themeConfig?: any }) {
    return await prisma.organization.create({ data });
  },

  /**
   * Retrieves organization-specific branding and configuration.
   */
  async getBySlug(slug: string) {
    return await prisma.organization.findUnique({
      where: { slug },
      include: { 
        departments: { include: { groups: true } }
      }
    });
  },

  /**
   * Enrolls a user into an organization.
   */
  async enrollUser(userId: string, organizationId: string, departmentId?: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { organizationId, departmentId }
    });
  }
};
