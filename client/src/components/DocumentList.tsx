import type { DocumentRecord } from '../types';

type Props = {
  documents: DocumentRecord[];
  onOpen: (id: string) => void;
};

export function DocumentList({ documents, onOpen }: Props) {
  if (documents.length === 0) {
    return <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-slate-500">No documents yet.</div>;
  }

  return (
    <div className="grid gap-3">
      {documents.map((document) => (
        <button
          key={document._id}
          onClick={() => onOpen(document._id)}
          className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft"
        >
          <div className="font-medium text-slate-900">{document.title}</div>
          <div className="mt-1 text-sm text-slate-500">Last modified {new Date(document.updatedAt).toLocaleString()}</div>
        </button>
      ))}
    </div>
  );
}