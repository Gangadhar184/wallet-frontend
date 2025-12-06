import { AuthProvider } from './hooks/useAuth';
import { AppRoutes } from './routing/AppRoutes';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}

export default App;