// import api from './axios'; // Import the Axios instance
// import { API_ENDPOINTS } from './endpoints'; // The endpoints file (will contain all API paths)

// const postService = {
//   // Fetch all posts
//   fetchPosts: async () => {
//     const response = await api.get(API_ENDPOINTS.POSTS); // Get posts from the API
//     return response.data; // Return the posts data directly
//   },

//   // Fetch a single post by ID
//   fetchPostById: async (id) => {
//     const response = await api.get(`${API_ENDPOINTS.POSTS}/${id}`); // Get post by ID
//     return response.data; // Return the post data directly
//   },

//   // Create a new post
//   createPost: async (postData) => {
//     const response = await api.post(API_ENDPOINTS.POSTS, postData); // Send POST request to create a new post
//     return response.data; // Return the created post data
//   },
// };

// export default postService;
// api/services/postService.js
import apiService from './apiService'; // Generic API service
import { getConfigByKey } from '../configLoader'; // Function to fetch configuration by key
import api from './axios'; // Axios instance

let baseUrl = null; // Store the base URL after fetching it once

// Function to initialize the base URL
const initializeBaseUrl = async () => {
  if (!baseUrl) {
    baseUrl = await getConfigByKey('API_BASE_URL');
    api.defaults.baseURL = baseUrl; // Set the base URL for the Axios instance
  }
};

// Post-specific API logic
const postService = {
  fetchPosts: async () => {
    await initializeBaseUrl();
    return apiService.getAll('/posts'); // Axios will use the default base URL
  },
  fetchPostById: async (id) => {
    await initializeBaseUrl();
    return apiService.getById('/posts', id);
  },
  createPost: async (postData) => {
    await initializeBaseUrl();
    return apiService.create('/posts', postData);
  },
  updatePost: async (id, postData) => {
    await initializeBaseUrl();
    return apiService.update('/posts', id, postData);
  },
  deletePost: async (id) => {
    await initializeBaseUrl();
    return apiService.delete('/posts', id);
  },
};

export default postService;
