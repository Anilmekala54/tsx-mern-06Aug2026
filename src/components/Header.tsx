import { useAuth } from '../auth/AuthContext';
import { useTheme } from '../theme/ThemeContext';

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export function Header() {
  const { isAuthenticated, username, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-panel/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-4.5 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className="relative w-8.5 h-8.5 flex-shrink-0 rounded-full border-2 border-accent before:content-[''] before:absolute before:bg-accent before:w-0.5 before:h-3.5 before:left-1/2 before:top-1/2 before:-translate-x-1/2 before:-translate-y-1/2 after:content-[''] after:absolute after:bg-accent after:w-3.5 after:h-0.5 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
            aria-hidden="true"
          />
          <div>
            <h1 className="font-display text-base tracking-[0.08em] uppercase m-0">Holoarchive</h1>
            <p className="m-0 mt-0.5 text-text-muted text-xs font-mono tracking-wide">Galactic census terminal</p>
          </div>
        </div>
        <div className="flex items-center gap-3 font-mono text-sm">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            title={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            className="flex items-center justify-center w-9 h-9 rounded-md border border-border-bright bg-panel-alt text-text cursor-pointer transition hover:border-accent hover:text-accent hover:-translate-y-px active:translate-y-0"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
          {isAuthenticated && (
            <>
              <span>
                Signed in as <span className="text-accent">{username}</span>
              </span>
              <button
                type="button"
                className="font-mono text-xs tracking-wide px-4 py-2 rounded-md border border-border-bright bg-panel-alt text-text cursor-pointer transition hover:border-accent hover:-translate-y-px active:translate-y-0"
                onClick={logout}
              >
                Log out
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
