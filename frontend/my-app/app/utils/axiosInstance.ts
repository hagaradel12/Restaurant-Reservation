import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3001',  // Your backend URL
});

// Add the Authorization token from localStorage to every request
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token'); // Get token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Set the token in the Authorization header
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response Error:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
