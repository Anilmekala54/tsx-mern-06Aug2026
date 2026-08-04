export function Loader({ label = 'Loading census records…' }: { label?: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20 px-5 text-center text-text-muted"
      role="status"
      aria-live="polite"
    >
      <div
        className="w-11 h-11 rounded-full border-[3px] border-border border-t-accent animate-spin-slow"
        aria-hidden="true"
      />
      <p className="font-mono text-text text-sm tracking-wide">{label}</p>
    </div>
  );
}
