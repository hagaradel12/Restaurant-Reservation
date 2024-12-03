// /app/utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL:"http://localhost:3001", // Use your backend URL here
    timeout: 5000, // Optional: set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor
axiosInstance.interceptors.request.use(
    (config) => {
      console.log("Request Sent:", config);
      return config;
    },
    (error) => {
      console.error("Request Error:", error);
      return Promise.reject(error);
    }
  );
  
  // Response Interceptor
  axiosInstance.interceptors.response.use(
    (response) => {
      console.log("Response Received:", response);
      return response;
    },
    (error) => {
      console.error("Response Error:", error);
      return Promise.reject(error);
    }
  );
  
  export default axiosInstance;