export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 py-20 px-5 text-center text-text-muted"
      role="alert"
    >
      <div className="text-3xl" aria-hidden="true">
        ⚠
      </div>
      <p className="font-mono text-danger text-sm tracking-wide">Transmission failed</p>
      <p>{message}</p>
      <button
        type="button"
        className="font-mono text-sm tracking-wide px-4 py-2 rounded-md border border-accent bg-accent text-[#05201d] font-semibold cursor-pointer transition hover:bg-accent-strong hover:border-accent-strong active:translate-y-0"
        onClick={onRetry}
      >
        Retry connection
      </button>
    </div>
  );
}
