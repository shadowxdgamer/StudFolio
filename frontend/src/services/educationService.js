import api from './api';

const educationService = {
    // Get all education entries
    getAll: async () => {
        const response = await api.get('/profile/education');
        return response.data.data;
    },

    // Add new education entry
    add: async (educationData) => {
        const response = await api.post('/profile/education', educationData);
        return response.data.data;
    },

    // Update education entry
    update: async (id, educationData) => {
        const response = await api.put(`/profile/education/${id}`, educationData);
        return response.data.data;
    },

    // Delete education entry
    delete: async (id) => {
        const response = await api.delete(`/profile/education/${id}`);
        return response.data.data;
    }
};

export default educationService;
