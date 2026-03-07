import { prisma } from '../../config/db';

export const CertificationService = {
  /**
   * Issues a certificate to a student for completing a course.
   * Includes Open Badges 2.0 compliant metadata.
   */
  async issueCertificate(studentId: string, courseId: string) {
    // 1. Check if student passed the proctored exam (if applicable)
    const proctoredExam = await prisma.proctoredExam.findFirst({
      where: { lesson: { module: { courseId } } },
    });

    if (proctoredExam) {
      const session = await prisma.proctoringSession.findFirst({
        where: { studentId, examId: proctoredExam.id, status: 'COMPLETED' },
      });
      if (!session) {
        throw new Error('Proctored exam not completed for this course.');
      }
    }

    // 2. Generate certificate PDF URL (Mocked)
    const pdfUrl = `https://storage.techlearn.ng/certs/${studentId}_${courseId}.pdf`;
    
    // 3. Construct Open Badges 2.0 Metadata
    const metadata = {
      "@context": "https://w3id.org/openbadges/v2",
      "type": "BadgeClass",
      "name": "TechLearn Verified Professional",
      "description": "Demonstrated mastery in course concepts with proctored verification.",
      "image": "https://techlearn.ng/badges/verified-pro.png",
      "issuer": {
        "type": "Issuer",
        "name": "TechLearn LMS",
        "url": "https://techlearn.ng"
      }
    };

    return await prisma.certificate.create({
      data: {
        studentId,
        courseId,
        pdfUrl,
        metadata,
      },
    });
  },

  async getStudentCertificates(studentId: string) {
    return await prisma.certificate.findMany({
      where: { studentId },
    });
  },
};
