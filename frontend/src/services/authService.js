import api from './api';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = import.meta.env.VITE_TOKEN_KEY || 'studfolio_token';

export const authService = {
    // Register a new user
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },    // Login user
    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        const { accessToken, refreshToken, user } = response.data;

        if (accessToken && refreshToken) {
            localStorage.setItem(import.meta.env.VITE_ACCESS_TOKEN_KEY || 'studfolio_access_token', accessToken);
            localStorage.setItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'studfolio_refresh_token', refreshToken);
        }

        return { accessToken, refreshToken, user };
    },    // Logout user
    logout: () => {
        localStorage.removeItem(import.meta.env.VITE_ACCESS_TOKEN_KEY || 'studfolio_access_token');
        localStorage.removeItem(import.meta.env.VITE_REFRESH_TOKEN_KEY || 'studfolio_refresh_token');
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return false;

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            // Check if token is expired
            if (decoded.exp < currentTime) {
                localStorage.removeItem(TOKEN_KEY);
                return false;
            }

            return true;
        } catch (error) {
            localStorage.removeItem(TOKEN_KEY);
            return false;
        }
    },

    // Get current user info
    getCurrentUser: () => {
        try {
            const token = localStorage.getItem(TOKEN_KEY);
            if (!token) return null;

            const decoded = jwtDecode(token);
            return decoded;
        } catch (error) {
            return null;
        }
    },

    // Request password reset
    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    // Reset password with token
    resetPassword: async (token, newPassword) => {
        const response = await api.post('/auth/reset-password', {
            token,
            password: newPassword
        });
        return response.data;
    },

    // Update user password
    updatePassword: async (currentPassword, newPassword) => {
        const response = await api.post('/auth/update-password', {
            currentPassword,
            newPassword
        });
        return response.data;
    },

    // Verify email with token
    verifyEmail: async (token) => {
        const response = await api.get(`/auth/verify-email/${token}`);
        return response.data;
    }
};

export default authService;
