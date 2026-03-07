import { prisma } from '../../config/db';

export const ProgressService = {
  /**
   * Checks if a student is eligible to access a specific lesson.
   * Eligibility depends on having completed all prior lessons in the same course.
   */
  async canAccessLesson(studentId: string, lessonId: string): Promise<boolean> {
    const currentLesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });

    if (!currentLesson) throw new Error('Lesson not found');

    const courseId = currentLesson.module.courseId;

    // Get all lessons in the course, ordered by module sequence and lesson sequence
    const allLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      orderBy: [
        { module: { order: 'asc' } },
        { order: 'asc' },
      ],
      select: { id: true },
    });

    const currentIndex = allLessons.findIndex((l: { id: string }) => l.id === lessonId);

    // Lessons before the current one
    const precedingLessons = allLessons.slice(0, currentIndex);
    const precedingLessonIds = precedingLessons.map((l: { id: string }) => l.id);

    if (precedingLessonIds.length === 0) return true; // First lesson is always accessible

    // Count how many of the preceding lessons have been completed
    const completedCount = await prisma.lessonCompletion.count({
      where: {
        studentId,
        lessonId: { in: precedingLessonIds },
        completed: true,
      },
    });

    return completedCount === precedingLessonIds.length;
  },

  /**
   * Marks a lesson as completed for a student.
   */
  async markAsCompleted(studentId: string, lessonId: string) {
    return await prisma.lessonCompletion.upsert({
      where: {
        studentId_lessonId: { studentId, lessonId },
      },
      update: { completed: true },
      create: { studentId, lessonId, completed: true },
    });
  },

  /**
   * Retrieves the progress percentage of a student in a course.
   */
  async getCourseProgress(studentId: string, courseId: string) {
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } },
    });

    if (totalLessons === 0) return 0;

    const completedLessons = await prisma.lessonCompletion.count({
      where: {
        studentId,
        lesson: { module: { courseId } },
        completed: true,
      },
    });

    return Math.round((completedLessons / totalLessons) * 100);
  },

  /**
   * Checks for a "Next Lesson" for the student to continue.
   */
  async getNextLesson(studentId: string, courseId: string) {
    const allLessons = await prisma.lesson.findMany({
      where: { module: { courseId } },
      orderBy: [
        { module: { order: 'asc' } },
        { order: 'asc' },
      ],
      include: { completions: { where: { studentId } } }
    });

    // Find the first lesson that is not completed
    const next = allLessons.find((l: any) => l.completions.length === 0);
    return next || null;
  }
};
