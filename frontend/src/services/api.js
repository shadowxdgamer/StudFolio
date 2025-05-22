import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(import.meta.env.VITE_TOKEN_KEY || 'studfolio_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle common error cases
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 401 Unauthorized errors (token expired/invalid)
        if (error.response && error.response.status === 401) {
            localStorage.removeItem(import.meta.env.VITE_TOKEN_KEY || 'studfolio_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
