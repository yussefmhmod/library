import { AuthProvider, useAuth } from './hooks/useAuth';
import LoginPage from './components/LoginPage';
import BookShelf from './components/BookCard';

function AppContent() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#94a3b8',
        fontSize: '18px',
      }}>
        Loading...
      </div>
    );
  }

  return user ? <BookShelf /> : <LoginPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
