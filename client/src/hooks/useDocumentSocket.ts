import { useEffect, useRef } from 'react';
import { getSocket } from '../services/socket';

type Options = {
  documentId: string;
  onDocumentLoaded: (document: any) => void;
  onRemoteChange: (payload: any) => void;
  onSaved: (document: any) => void;
};

export function useDocumentSocket({ documentId, onDocumentLoaded, onRemoteChange, onSaved }: Options) {
  // Store callbacks in refs so the effect never needs to re-run when they change
  const onDocumentLoadedRef = useRef(onDocumentLoaded);
  const onRemoteChangeRef = useRef(onRemoteChange);
  const onSavedRef = useRef(onSaved);

  // Keep refs up to date without triggering re-runs
  useEffect(() => {
    onDocumentLoadedRef.current = onDocumentLoaded;
    onRemoteChangeRef.current = onRemoteChange;
    onSavedRef.current = onSaved;
  });

  useEffect(() => {
    const socket = getSocket();

    const handleDocumentLoaded = ({ document }: { document: any }) =>
      onDocumentLoadedRef.current(document);
    const handleRemoteChange = (payload: { content?: any; title?: string }) =>
      onRemoteChangeRef.current(payload);
    const handleSaved = ({ document }: { document: any }) =>
      onSavedRef.current(document);

    // Register listeners FIRST, then join
    socket.on('document-loaded', handleDocumentLoaded);
    socket.on('receive-changes', handleRemoteChange);
    socket.on('document-updated', handleSaved);

    socket.emit('join-document', { documentId });

    return () => {
      socket.off('document-loaded', handleDocumentLoaded);
      socket.off('receive-changes', handleRemoteChange);
      socket.off('document-updated', handleSaved);
      socket.emit('leave-document', { documentId }); // ← also cleanly leave the room
    };
  }, [documentId]); // ← ONLY re-run when documentId changes
}