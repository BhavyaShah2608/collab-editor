type Props = {
  onHome: () => void;
};

export function Navbar({ onHome }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-6">
      <button onClick={onHome} className="text-left text-lg font-semibold text-slate-900">
        Collab Editor
      </button>
      <span className="text-sm text-slate-500">Real-time docs</span>
    </header>
  );
}