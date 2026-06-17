type Props = {
  status: 'idle' | 'saving' | 'saved' | 'error';
};

export function SaveStatus({ status }: Props) {
  const label =
    status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : status === 'error' ? 'Save failed' : 'Idle';

  return <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">{label}</span>;
}