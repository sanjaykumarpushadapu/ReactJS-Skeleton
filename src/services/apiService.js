// api/services/apiService.js
import api from './axios';

// Generic API service for handling all CRUD operations
const apiService = {
  getAll: async (endpoint) => {
    const response = await api.get(endpoint);
    return response.data;
  },

  getById: async (endpoint, id) => {
    const response = await api.get(`${endpoint}/${id}`);
    return response.data;
  },

  create: async (endpoint, data) => {
    const response = await api.post(endpoint, data);
    return response.data;
  },

  update: async (endpoint, id, data) => {
    const response = await api.put(`${endpoint}/${id}`, data);
    return response.data;
  },

  delete: async (endpoint, id) => {
    await api.delete(`${endpoint}/${id}`);
    return id; // Return the ID for further use (like removing the post from the state)
  },
};

export default apiService;
