interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const btnClass =
  'font-mono text-xs tracking-wide px-4 py-2 rounded-md border border-border-bright bg-transparent text-text cursor-pointer transition hover:border-accent hover:-translate-y-px active:translate-y-0 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-border-bright disabled:hover:translate-y-0';

export function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <nav className="flex items-center justify-center gap-2.5 mt-8 font-mono text-sm" aria-label="Pagination">
      <button type="button" className={btnClass} onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
        ← Prev
      </button>
      <span className="text-text-muted">
        Page {page} / {totalPages}
      </span>
      <button
        type="button"
        className={btnClass}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
