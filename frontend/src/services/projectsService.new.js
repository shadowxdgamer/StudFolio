import api from './api';

const projectsService = {
    // Get all projects for the current user
    getAll: async () => {
        const response = await api.get('/profile/projects');
        return response.data.data;
    },

    // Get a single project by ID
    getById: async (id) => {
        const response = await api.get(`/profile/projects/${id}`);
        return response.data.data;
    },

    // Create a new project
    add: async (projectData) => {
        const response = await api.post('/profile/projects', projectData);
        return response.data.data;
    },

    // Update an existing project
    update: async (id, projectData) => {
        const response = await api.put(`/profile/projects/${id}`, projectData);
        return response.data.data;
    },

    // Delete a project
    delete: async (id) => {
        const response = await api.delete(`/profile/projects/${id}`);
        return response.data.data;
    },

    // Get featured projects
    getFeatured: async () => {
        const response = await api.get('/profile/projects/featured');
        return response.data.data;
    }
};

export default projectsService;
