import api from './api';

const profileService = {    // Get current user profile
    getProfile: async () => {
        const response = await api.get('/profile/me');
        return response.data.data;
    },    // Create or update profile
    updateProfile: async (profileData) => {
        const response = await api.post('/profile', profileData);
        return response.data;
    },

    // Update social links
    updateSocialLinks: async (socialData) => {
        const response = await api.put('/profile/social', socialData);
        return response.data;
    },

    // Get profile by ID (for public viewing)
    getProfileById: async (id) => {
        const response = await api.get(`/profile/${id}`);
        return response.data;
    },

    // Education related endpoints
    education: {
        getAll: async () => {
            const response = await api.get('/profile/education');
            return response.data.data || [];
        },
        add: async (educationData) => {
            const response = await api.post('/profile/education', educationData);
            return response.data;
        },
        update: async (id, educationData) => {
            const response = await api.put(`/profile/education/${id}`, educationData);
            return response.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/profile/education/${id}`);
            return response.data;
        }
    },    // Experience related endpoints
    experience: {
        getAll: async () => {
            const response = await api.get('/profile/experience');
            return response.data.data || [];
        },
        add: async (experienceData) => {
            const response = await api.post('/profile/experience', experienceData);
            return response.data.data;
        },
        update: async (id, experienceData) => {
            const response = await api.put(`/profile/experience/${id}`, experienceData);
            return response.data.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/profile/experience/${id}`);
            return response.data.data;
        }
    },    // Skills related endpoints
    skills: {
        getAll: async () => {
            const response = await api.get('/profile/skills');
            return response.data.data || [];
        },
        add: async (skillData) => {
            const response = await api.post('/profile/skills', skillData);
            return response.data.data;
        },
        update: async (id, skillData) => {
            const response = await api.put(`/profile/skills/${id}`, skillData);
            return response.data.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/profile/skills/${id}`);
            return response.data.data;
        }
    },    // Languages related endpoints
    languages: {
        getAll: async () => {
            const response = await api.get('/profile/languages');
            return response.data.data || [];
        },
        add: async (languageData) => {
            const response = await api.post('/profile/languages', languageData);
            return response.data.data;
        },
        update: async (id, languageData) => {
            const response = await api.put(`/profile/languages/${id}`, languageData);
            return response.data.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/profile/languages/${id}`);
            return response.data.data;
        }
    },

    // Projects related endpoints
    projects: {
        getAll: async () => {
            const response = await api.get('/profile/projects');
            return response.data;
        },
        add: async (projectData) => {
            const response = await api.post('/profile/projects', projectData);
            return response.data;
        },
        update: async (id, projectData) => {
            const response = await api.put(`/profile/projects/${id}`, projectData);
            return response.data;
        },
        delete: async (id) => {
            const response = await api.delete(`/profile/projects/${id}`);
            return response.data;
        }
    },    // CV generation endpoint
    generateCV: async () => {
        const response = await api.get('/cv/generate', { responseType: 'blob' });
        return response.data;
    },

    // Get CV preview data
    getCVPreview: async () => {
        const response = await api.get('/cv/preview');
        return response.data.data;
    }
};

export default profileService;
