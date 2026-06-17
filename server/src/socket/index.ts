import type { Server } from 'socket.io';
import { saveDocument } from '../services/documentStore';
import type { DocumentContent } from '../types';

type JoinPayload = {
  documentId: string;
};

type ChangePayload = {
  documentId: string;
  title?: string;
  content?: DocumentContent;
};

type SaveAck = {
  ok: boolean;
  error?: string;
};

export function registerSocketHandlers(io: Server): void {
  io.on('connection', (socket) => {
    socket.on('join-document', async (payload: JoinPayload) => {
      if (!payload?.documentId) {
        return;
      }

      socket.join(payload.documentId);
    });

    socket.on('send-changes', (payload: ChangePayload) => {
      if (!payload?.documentId) {
        return;
      }

      socket.to(payload.documentId).emit('receive-changes', payload);
    });

    socket.on('save-document', async (payload: ChangePayload, callback?: (response: SaveAck) => void) => {
      try {
        if (!payload?.documentId) {
          callback?.({ ok: false, error: 'Missing document id.' });
          return;
        }

        const patch: { title?: string; content?: DocumentContent } = {};

        if (payload.title !== undefined) {
          patch.title = payload.title;
        }

        if (payload.content !== undefined) {
          patch.content = payload.content;
        }

        await saveDocument(payload.documentId, patch);

        callback?.({ ok: true });
      } catch (error) {
        callback?.({ ok: false, error: error instanceof Error ? error.message : 'Failed to save document.' });
      }
    });
  });
}