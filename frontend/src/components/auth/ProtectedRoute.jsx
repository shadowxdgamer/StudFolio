import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { CircularProgress, Box } from '@mui/material';

/**
 * ProtectedRoute component
 * Wraps routes that require authentication
 * If user is not authenticated, redirects to login page
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Show loading state if auth is still initializing
  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        height: '100vh'
      }}>
        <CircularProgress />
      </Box>
    );
  }
  
  // Redirect to login page if user is not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // Special handling for CV route
  if (location.pathname === '/dashboard/cv') {
    // You might want to check if profile exists before allowing access to CV
    const hasProfile = localStorage.getItem('has_profile');
    if (!hasProfile) {
      return <Navigate to="/dashboard/profile" replace />;
    }
  }

  // Render children if authenticated
  return children;
};

export default ProtectedRoute;
