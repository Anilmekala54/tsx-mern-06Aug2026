import { AuthProvider, useAuth } from './auth/AuthContext';
import { CharacterBrowser } from './components/CharacterBrowser';
import { ErrorState } from './components/ErrorState';
import { Header } from './components/Header';
import { Loader } from './components/Loader';
import { LoginForm } from './components/LoginForm';
import { useSwapiData } from './hooks/useSwapiData';
import { ThemeProvider } from './theme/ThemeContext';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { data, loading, error, reload } = useSwapiData();

  return (
    <div className="flex-1 flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-6 pt-7 pb-16 w-full">
        {!isAuthenticated && <LoginForm />}
        {isAuthenticated && loading && <Loader />}
        {isAuthenticated && !loading && error && <ErrorState message={error} onRetry={reload} />}
        {isAuthenticated && !loading && !error && data && <CharacterBrowser data={data} />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
