import api from './api';

const languagesService = {    // Get all languages for the current user
    getAll: async () => {
        const response = await api.get('/profile/languages');
        return response.data.data;
    },

    // Get a single language by ID
    getById: async (id) => {
        const response = await api.get(`/profile/languages/${id}`);
        return response.data.data;
    },

    // Create a new language
    add: async (languageData) => {
        const response = await api.post('/profile/languages', languageData);
        return response.data.data;
    },

    // Update an existing language
    update: async (id, languageData) => {
        const response = await api.put(`/profile/languages/${id}`, languageData);
        return response.data.data;
    },

    // Delete a language
    delete: async (id) => {
        const response = await api.delete(`/profile/languages/${id}`);
        return response.data.data;
    }
};

export default languagesService;
