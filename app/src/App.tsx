import { AppRouter } from './router/AppRouter';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster position="top-center" />
    </>
  );
}

export default App;
