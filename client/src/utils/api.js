import axios from 'axios';

// Create an instance of axios with a base URL for our backend API
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Replace with your backend API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

// Optional: Add an interceptor to automatically include the JWT for authenticated requests
// We'll implement this fully when we set up our Authentication Context
/*
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Or whenever you store the token
        if (token) {
            config.headers['Authorization'] = 'Bearer ${token}';
            };
            return config;
            },
            (error) => {
                return Promise.reject(error);
            }
            );
            */
export default api;