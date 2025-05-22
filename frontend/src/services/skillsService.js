import api from './api';

const skillsService = {
    // Get all skills
    getAll: async () => {
        const response = await api.get('/profile/skills');
        return response.data.data;
    },

    // Add new skill
    add: async (skillData) => {
        const response = await api.post('/profile/skills', skillData);
        return response.data.data;
    },

    // Update skill
    update: async (id, skillData) => {
        const response = await api.put(`/profile/skills/${id}`, skillData);
        return response.data.data;
    },

    // Delete skill
    delete: async (id) => {
        const response = await api.delete(`/profile/skills/${id}`);
        return response.data.data;
    },

    // Get skills by category
    getByCategory: async (category) => {
        const response = await api.get('/profile/skills');
        const skills = response.data.data;
        return skills.filter(skill => skill.category === category);
    }
};

export default skillsService;
