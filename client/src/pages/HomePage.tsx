import { useEffect, useState } from 'react';
import { createDocument, fetchDocuments } from '../services/api';
import type { DocumentRecord } from '../types';
import { Navbar } from '../components/Navbar';
import { DocumentList } from '../components/DocumentList';

type Props = {
  navigate: (path: string) => void;
};

export function HomePage({ navigate }: Props) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments()
      .then(setDocuments)
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    const document = await createDocument();
    navigate(`/doc/${document._id}`);
    window.history.pushState({}, '', `/doc/${document._id}`);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#e2e8f0,_#f8fafc_55%,_#eef2ff)] text-slate-900">
      <Navbar onHome={() => navigate('/')} />
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-white/60 bg-white/80 p-8 shadow-soft backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">Documents</h1>
              <p className="mt-2 text-slate-600">Create a link, share it, and edit together in real time.</p>
            </div>
            <button onClick={handleCreate} className="rounded-2xl bg-slate-900 px-5 py-3 font-medium text-white transition hover:bg-slate-800">
              New Document
            </button>
          </div>
        </section>

        <section className="mt-8">
          {loading ? <div className="text-slate-500">Loading documents...</div> : <DocumentList documents={documents} onOpen={(id) => navigate(`/doc/${id}`)} />}
        </section>
      </main>
    </div>
  );
}