import { Octokit } from '@octokit/rest';
import { prisma } from '../../config/db';

export const GitHubService = {
  /**
   * Links a student's GitHub account using an access token.
   * In production, this would be part of an OAuth flow.
   */
  async linkAccount(userId: string, githubUsername: string, accessToken: string) {
    return await prisma.gitHubIntegration.upsert({
      where: { userId },
      update: { githubUsername, accessToken },
      create: { userId, githubUsername, accessToken },
    });
  },

  /**
   * Associates a GitHub repository with a specific course project.
   */
  async linkProject(userId: string, courseId: string, repoUrl: string, branch: string = 'main') {
    return await prisma.externalProject.create({
      data: { userId, courseId, repoUrl, branch },
    });
  },

  /**
   * Syncs metadata (latest commits) from the linked GitHub repository.
   * Real implementation would use the accessToken to call GitHub API.
   */
  async syncProject(projectId: string) {
    const project = await prisma.externalProject.findUnique({
      where: { id: projectId },
      include: { user: { include: { githubIntegration: true } } }
    });

    if (!project || !project.user.githubIntegration) {
      throw new Error('Project or GitHub integration not found');
    }

    const { accessToken } = project.user.githubIntegration;
    const octokit = new Octokit({ auth: accessToken });

    // Parse owner and repo from URL (e.g., https://github.com/owner/repo)
    const urlParts = project.repoUrl.replace('https://github.com/', '').split('/');
    const owner = urlParts[0];
    const repo = urlParts[1];

    try {
      const { data: commits } = await octokit.repos.listCommits({
        owner,
        repo,
        sha: project.branch,
        per_page: 5,
      });

      // Update lastSyncAt and potentially trigger an AI integrity check on the code
      await prisma.externalProject.update({
        where: { id: projectId },
        data: { lastSyncAt: new Date() },
      });

      return {
        latestCommits: commits.map(c => ({
          sha: c.sha,
          message: c.commit.message,
          date: c.commit.author?.date,
        })),
      };
    } catch (error: any) {
      console.error('GitHub Sync Error:', error.message);
      throw new Error(`Failed to sync with GitHub: ${error.message}`);
    }
  },

  /**
   * Mocked AI Review for an external repo.
   */
  async analyzeIntegrity(projectId: string) {
    // Simulate analyzing external code for plagiarism or AI generation
    const score = Math.floor(Math.random() * 40) + 60; // 60-100

    await prisma.externalProject.update({
      where: { id: projectId },
      data: { integrityScore: score },
    });

    return { integrityScore: score, status: 'VERIFIED' };
  }
};
