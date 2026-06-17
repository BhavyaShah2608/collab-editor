type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function DocumentTitle({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full bg-transparent text-2xl font-semibold text-slate-900 outline-none"
      placeholder="Untitled Document"
    />
  );
}