import { prisma } from '../../config/db';

/**
 * MOCKED AI Tutor Service.
 * Real implementation would use OpenAI/Anthropic/Google Gemini API.
 */
export const AITutorService = {
  async getLessonHelp(userId: string, lessonId: string, question: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });

    if (!lesson) throw new Error('Lesson not found');

    // Simulate RAG (Retrieval Augmented Generation) context
    const context = `Course: ${lesson.module.course.title}, Module: ${lesson.module.title}, Lesson: ${lesson.title}`;
    
    // Simulating an LLM response based on the context
    // Real call: const response = await llmClient.complete({ prompt: ..., context });
    
    return {
      answer: `[AI TUTOR DEBUG]: Based on the lesson "${lesson.title}", you asked: "${question}". Here is a detailed explanation related to the ${lesson.module.course.title} level...`,
      sources: [`Lesson: ${lesson.title}`],
    };
  }
};
