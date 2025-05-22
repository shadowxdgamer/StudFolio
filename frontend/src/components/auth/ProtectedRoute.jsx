import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * ProtectedRoute component
 * Wraps routes that require authentication
 * If user is not authenticated, redirects to login page
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state if auth is still initializing
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        Loading...
      </div>
    );
  }
  
  // Redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
