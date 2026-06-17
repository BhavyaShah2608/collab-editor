import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DocumentTitle } from '../components/DocumentTitle';
import { SaveStatus } from '../components/SaveStatus';
import { Editor } from '../components/Editor';
import { Navbar } from '../components/Navbar';
import { fetchDocument } from '../services/api';
import { getSocket } from '../services/socket';
import { useDocumentSocket } from '../hooks/useDocumentSocket';
import type { DocumentContent, DocumentRecord } from '../types';

type Props = {
  documentId: string;
};

export function DocumentPage({ documentId }: Props) {
  const [document, setDocument] = useState<DocumentRecord | null>(null);
  const [title, setTitle] = useState('Untitled Document');
  const [content, setContent] = useState<DocumentContent>({ type: 'doc', content: [{ type: 'paragraph' }] });
  const [remoteContent, setRemoteContent] = useState<DocumentContent | null>(null);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'error'>('idle');

  // Track whether content has been loaded from server — prevents premature send-changes
  const isLoadedRef = useRef(false);

  useEffect(() => {
    fetchDocument(documentId)
      .then((loaded) => {
        setDocument(loaded);
        setTitle(loaded.title);
        setContent(loaded.content);
        isLoadedRef.current = true;
      })
      .catch(() => {
        // Don't emit join-document here — useDocumentSocket handles it
        // Just mark that we'll load via socket instead
      });
  }, [documentId]);

  // Stable callbacks — won't re-trigger useDocumentSocket's effect
  const handleDocumentLoaded = useCallback((loaded: DocumentRecord) => {
    setDocument(loaded);
    setTitle(loaded.title);
    setContent(loaded.content); 
    isLoadedRef.current = true;
  }, []);

  const handleRemoteChange = useCallback((payload: { content?: DocumentContent; title?: string }) => {
    if (payload?.title !== undefined) {
      setTitle(payload.title);
    }
    if (payload?.content) {
      setRemoteContent(payload.content);
    }
  }, []);

  const handleSaved = useCallback((savedDocument: DocumentRecord) => {
    setDocument(savedDocument);
    setStatus('saved');
  }, []);

  useDocumentSocket({
    documentId,
    onDocumentLoaded: handleDocumentLoaded,
    onRemoteChange: handleRemoteChange,
    onSaved: handleSaved,
  });

  // Autosave — only depends on content+title changing, not savePayload object
  useEffect(() => {
    if (!document || !isLoadedRef.current) return; // Don't save before content is loaded

    setStatus('saving');
    const socket = getSocket();
    const timeout = window.setTimeout(() => {
      socket.emit('save-document', { documentId, title, content }, (response: { ok: boolean; error?: string }) => {
        setStatus(response.ok ? 'saved' : 'error');
      });
    }, 2000);

    return () => window.clearTimeout(timeout);
  }, [content, title, documentId, document]);

  // Broadcast changes to collaborators — only after content is loaded from server
  useEffect(() => {
    if (!isLoadedRef.current) return; // ← prevents broadcasting empty doc on mount

    getSocket().emit('send-changes', { documentId, content, title });
  }, [content, documentId, title]);

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopyState('copied');
      window.setTimeout(() => setCopyState('idle'), 1500);
    } catch {
      setCopyState('error');
      window.setTimeout(() => setCopyState('idle'), 1500);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar onHome={() => (window.location.href = '/')} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <DocumentTitle
            value={title}
            onChange={(nextTitle) => {
              setTitle(nextTitle);
              setStatus('saving');
              // Title change saves immediately, not debounced
              getSocket().emit('save-document', { documentId, title: nextTitle, content });
            }}
          />
          <div className="flex items-center gap-3">
            <SaveStatus status={status} />
            <button
              className="rounded-xl bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              onClick={() => void handleCopyLink()}
            >
              {copyState === 'copied' ? 'Copied!' : copyState === 'error' ? 'Copy failed' : 'Copy Link'}
            </button>
          </div>
        </div>

        <Editor
          content={content}
          onChange={(nextContent) => {
            setContent(nextContent);
            setStatus('saving');
          }}
          onRemoteContent={remoteContent}
        />
      </main>
    </div>
  );
}