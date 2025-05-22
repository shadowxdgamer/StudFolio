import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

// Create auth context
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on component mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
        }
      } catch (err) {
        console.error('Authentication initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login handler
  const login = async (credentials) => {
    try {
      setError(null);
      setLoading(true);
      const { token, user } = await authService.login(credentials);
      setUser(user);
      return { success: true, user };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to login';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      setError(null);
      setLoading(true);
      await authService.register(userData);
      return { 
        success: true, 
        message: 'Registration successful! Please check your email for verification.' 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to register';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Logout handler
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // Password reset request handler
  const forgotPassword = async (email) => {
    try {
      setLoading(true);
      setError(null);
      await authService.forgotPassword(email);
      return { 
        success: true, 
        message: 'Password reset instructions sent to your email.' 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to process request';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Reset password with token handler
  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await authService.resetPassword(token, newPassword);
      return { 
        success: true, 
        message: 'Password has been successfully reset. You can now login.' 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to reset password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };
  
  // Verify email handler
  const verifyEmail = async (token) => {
    try {
      setLoading(true);
      setError(null);
      await authService.verifyEmail(token);
      return { 
        success: true, 
        message: 'Email verification successful! You can now login.' 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to verify email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Update password handler
  const updatePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      await authService.updatePassword(currentPassword, newPassword);
      return { 
        success: true, 
        message: 'Password updated successfully.' 
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const contextValue = {
    user,
    isAuthenticated: !!user,
    loading,
    error,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
