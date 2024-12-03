// /app/utils/axiosInstance.ts
import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL, // Use your backend URL here
    timeout: 1000, // Optional: set a timeout for requests
    headers: {
        'Content-Type': 'application/json',
    },
});

export default axiosInstance;