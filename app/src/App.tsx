import { useEffect } from 'react';
import { AppRouter } from './router/AppRouter';
import { Toaster } from 'sonner';
import { useAuth } from './shared/hooks/useAuth';
import { useMe } from './domains/auth/hooks/useMe';

function AppContent() {
  const { login, logout, setIsLoading } = useAuth();
  const { data, isLoading, isError, isSuccess } = useMe();

  useEffect(() => {
    if (isLoading) {
      setIsLoading(true);
      return;
    }

    if (isSuccess && data?.user) {
      login(data.user, data.accessToken);
      setIsLoading(false);
    } else if (isError || data === null) {
      logout();
      setIsLoading(false);
    }
  }, [data, isLoading, isError, isSuccess, login, logout, setIsLoading]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] text-[#2D6A4F]">Loading...</div>;
  }

  return (
    <>
      <AppRouter />
      <Toaster position="top-center" />
    </>
  );
}

function App() {
  return <AppContent />;
}

export default App;
