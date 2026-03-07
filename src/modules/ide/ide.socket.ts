import { Server, Socket } from 'socket.io';
import { IntegrityService } from './integrity.service';

export const setupIDEsockets = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log(`🔌 IDE Socket connected: ${socket.id}`);

    // Join a specific submission session
    socket.on('join_submission', (submissionId: string) => {
      socket.join(`submission_${submissionId}`);
      console.log(`👤 Client joined submission: ${submissionId}`);
    });

    // Record a batch of keystrokes
    socket.on('record_keystrokes', async (data: { submissionId: string, events: any[] }) => {
      try {
        await IntegrityService.logKeystrokes(data.submissionId, data.events);
        // Optionally broadcast to instructors if they are watching live
        io.to(`instructor_view_${data.submissionId}`).emit('keystroke_update', data.events);
      } catch (error) {
        console.error('Error recording keystrokes via socket:', error);
      }
    });

    // Explicit violation flag (e.g. frontend detected paste)
    socket.on('illegal_action', async (data: { submissionId: string, type: string, description: string }) => {
      try {
        await IntegrityService.logViolation(data.submissionId, data.type, data.description);
        console.log(`⚠️ Violation logged via socket for ${data.submissionId}: ${data.type}`);
      } catch (error) {
        console.error('Error logging violation via socket:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log(`🔌 IDE Socket disconnected: ${socket.id}`);
    });
  });
};
