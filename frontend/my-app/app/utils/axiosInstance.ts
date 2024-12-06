import axios, { AxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',  // Your backend URL
  withCredentials: true,
  timeout: 10000,  // Set timeout to 10 seconds (10000 milliseconds)
});

// Add the Authorization token from localStorage to every request
axiosInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {  // Explicitly type config
    const token = localStorage.getItem('access_token'); // Get token from localStorage
    // Provide a default value for config.headers if undefined
    config.headers = config.headers || {};  // Ensure headers is always defined
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Set the token in the Authorization header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Request timed out');
    } else {
      console.error('Response Error:', error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
