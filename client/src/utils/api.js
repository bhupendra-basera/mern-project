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

api.interceptors.request.use(
    (config) => {
        // get the token from localStorage
        const token = localStorage.getItem('token'); // Or whenever you store the token
        
        // If token exists, add it to the Authorization header
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        };
        return config;
        },
        (error) => {
            return Promise.reject(error);
        }
        );

// Optional: Add a response interceptor to handle token exipration/invalidity globally
/*
api.interceptors.response.use(
    (response) => response, // Just return the response if successful
    (error) => {
        // Handle error, e.g., 401 Unauthorized or 403 Forbidden
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            console.error('Authentication error, loggin out...');
            // You might want to dispatch a logout action from your AuthContext here
            // This requires access to the context outside a component, which can be tricky.
            // Alternatively, handle 401/403 in individual API calls or a wrapper funcion.
            // For now, handling login/logout within AuthProvider is sufficient.
        }
        return Promise.reject(error); 
    }
);
*/

            
export default api;