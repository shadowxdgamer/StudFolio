import api from './api';

const experienceService = {
    // Get all experience entries
    getAll: async () => {
        const response = await api.get('/profile/experience');
        return response.data.data;
    },

    // Add new experience entry
    add: async (experienceData) => {
        const response = await api.post('/profile/experience', experienceData);
        return response.data.data;
    },

    // Update experience entry
    update: async (id, experienceData) => {
        const response = await api.put(`/profile/experience/${id}`, experienceData);
        return response.data.data;
    },

    // Delete experience entry
    delete: async (id) => {
        const response = await api.delete(`/profile/experience/${id}`);
        return response.data.data;
    }
};

export default experienceService;
