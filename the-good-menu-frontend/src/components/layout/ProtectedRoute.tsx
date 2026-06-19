// =============================================================================
// THE GOOD MENU — Protected Route Guard
// =============================================================================
// Checks useAuth() for an active session.
// - While loading: shows a centered spinner
// - If not authenticated: redirects to /login
// - If authenticated: renders the child <Outlet />
// =============================================================================

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show a loading indicator while checking auth state on initial mount
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-aboitiz-bgLight">
        <div className="spinner spinner-lg" />
      </div>
    );
  }

  // Redirect unauthenticated users to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected child routes
  return <Outlet />;
}
