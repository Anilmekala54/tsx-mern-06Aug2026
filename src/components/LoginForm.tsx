import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth/AuthContext';
import { DEMO_PASSWORD, DEMO_USERNAME } from '../auth/mockJwt';

export function LoginForm() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) setError('Access denied. Check your credentials and try again.');
  }

  return (
    <div className="min-h-[calc(100vh-90px)] flex items-center justify-center p-6">
      <div className="relative w-full max-w-sm overflow-hidden rounded-xl border border-border bg-panel p-8 before:content-[''] before:absolute before:inset-0 before:bg-[linear-gradient(120deg,transparent_40%,rgba(79,209,197,0.06)_50%,transparent_60%)] before:pointer-events-none">
        <h2 className="font-display text-lg tracking-wide uppercase m-0 mb-1.5">Holoarchive Access</h2>
        <p className="text-text-muted text-sm leading-relaxed m-0 mb-6">
          Sign in to browse the Star Wars census archive. Authentication is mocked client-side (JWT access + refresh
          tokens with silent refresh) for demo purposes.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block font-mono text-xs tracking-wide uppercase text-text-muted mb-1.5"
            >
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              className="w-full px-3 py-2.5 rounded-md border border-border bg-bg-grid text-text font-mono text-sm focus:border-accent focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block font-mono text-xs tracking-wide uppercase text-text-muted mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full px-3 py-2.5 rounded-md border border-border bg-bg-grid text-text font-mono text-sm focus:border-accent focus:outline-none"
            />
          </div>
          {error && (
            <p className="text-danger text-sm font-mono -mt-1.5 mb-4" role="alert">
              {error}
            </p>
          )}
          <button
            type="submit"
            className="w-full font-mono text-sm tracking-wide px-4 py-2.5 rounded-md border border-accent bg-accent text-[#05201d] font-semibold cursor-pointer transition hover:bg-accent-strong hover:border-accent-strong"
          >
            Enter archive
          </button>
        </form>
        <p className="mt-4.5 text-[0.72rem] text-text-muted font-mono leading-relaxed border-t border-dashed border-border pt-3.5">
          Demo credentials — username: {DEMO_USERNAME} · password: {DEMO_PASSWORD}
        </p>
      </div>
    </div>
  );
}
