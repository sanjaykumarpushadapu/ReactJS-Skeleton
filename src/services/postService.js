import api from './api'; // Import the Axios instance
import { API_ENDPOINTS } from './endpoints'; // The endpoints file (will contain all API paths)

const postService = {
  // Fetch all posts
  fetchPosts: async () => {
    const response = await api.get(API_ENDPOINTS.POSTS); // Get posts from the API
    return response.data; // Return the posts data directly
  },

  // Fetch a single post by ID
  fetchPostById: async (id) => {
    const response = await api.get(`${API_ENDPOINTS.POSTS}/${id}`); // Get post by ID
    return response.data; // Return the post data directly
  },

  // Create a new post
  createPost: async (postData) => {
    const response = await api.post(API_ENDPOINTS.POSTS, postData); // Send POST request to create a new post
    return response.data; // Return the created post data
  },
};

export default postService;
