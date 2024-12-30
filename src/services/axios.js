import axios from 'axios';

// Function to get the token from localStorage
const getToken = () => localStorage.getItem('authToken');

// Function to remove the token from localStorage
const removeToken = () => localStorage.removeItem('authToken');

// Initialize Axios instance
const api = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token && config.url !== '/login') {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach token if available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    if (response) {
      const { status } = response;

      if (status === 401) {
        console.error(
          'Unauthorized: Token expired or invalid. Please log in again.'
        );
        handleTokenExpiration();
      } else if (status === 500) {
        console.error('Internal Server Error: Something went wrong.');
      } else if (status === 403) {
        console.error('Forbidden: Access denied.');
      }
    } else {
      console.error('Network error or server is unreachable.');
    }

    return Promise.reject(error.response || error.message);
  }
);

// Function to handle token expiration
const handleTokenExpiration = () => {
  removeToken();
  window.location.href = '/login'; // Redirect to login page
};

export default api;
