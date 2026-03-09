import { prisma } from '../../config/db';

export class CourseService {
  static async createCourse(data: { title: string; description: string; level: string; instructorId: string }) {
    return await prisma.course.create({
      data,
    });
  }

  static async getAllCourses() {
    return await prisma.course.findMany({
      include: {
        instructor: {
          select: { firstName: true, lastName: true },
        },
      },
    });
  }

  static async getCourseById(id: string) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { firstName: true, lastName: true },
        },
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });

    if (!course) {
      throw { status: 404, message: 'Course not found' };
    }

    return course;
  }

  static async createModule(data: { title: string; order: number; courseId: string }) {
    return await prisma.module.create({
      data,
    });
  }

  static async createLesson(data: { 
    title: string; 
    type: any; 
    content?: string; 
    videoUrl?: string; 
    audioUrl?: string; 
    attachmentUrl?: string; 
    order: number; 
    moduleId: string 
  }) {
    return await prisma.lesson.create({
      data,
    });
  }

  static async getLessonById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          select: { courseId: true, title: true }
        }
      }
    });

    if (!lesson) {
      throw { status: 404, message: 'Lesson not found' };
    }

    return lesson;
  }
}
