import React, { createContext, useState, useEffect, useContext  } from  'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Import your API utility

// Create the Authentication Context
const AuthContext = createContext();

// Create the Auth Provider Component
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null); // To store logged-in user data
    const [loading, setLoading] = useState(true); // To indicate if auth state is being loaded
    const Navigate   = useNavigate();
    
    // Check for token in localStorage on initial load
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            // Optional: Validate token with backend or decode it here
            // For now, we'll assume a token in localStorage means possible authenticaticated
        }
        setLoading(false); // Finished checking localStorage
    },[]); // Empty dependency array menas run once on mount

    // Function to load user data if authenticated
    useEffect (() => {
        const loadUser = async () => {
        if (token) {
            try {
                // Set the token in the API utility header for this request
                // This will be handled automatically by the interceptor later, but manually
                // seting might be needed for the initial loadUser call if initerceptor
                // isn't set up yet or you need specified control.
                // Let's rely on the interceptor we'll add next

                const res = await api.get('/auth/user'); // Use the protected profile endpoint
                setUser(res.data);
                setIsAuthenticated(true);
            } catch (err) {
                console.error('Error loading user:', err);
                // If token is invalid or expired, clear it
                localStorage.removeItem('token');
                setToken(null);
                setIsAuthenticated(false);
                setUser(null);
            }
        }
        };

        // Only try to load user if a token exists and we're not already loading
        if (token && !user && loading === false) {
            loadUser();
        
        }else if(!token && loading === false){
            // If no token and not loading, ensure state is reset
            setIsAuthenticated(false);
            setUser(null);

        }
    },[token,loading]); // Re-run when token or loading state changes

    // Function to handle successful login
    const login = async (email, password) => {
        try{
            const res = await api.post('/auth/login', { email, password}) 
            const newToken = res.data.token;

            localStorage.setItem('token', newToken);
            setToken(newToken);
            console.log('1',isAuthenticated);
            setIsAuthenticated(true); // Set isAuthenticated true immediately
            console.log('2',isAuthenticated);
            // Load user data after setting the token
            const userRes = await api.get('/auth/user');
            setUser(userRes.data);

            return { success: true}; // Indicates success 
        } catch (err) {
            console.error('Login Error:', err.response.data.msg);
            logout(); // Clear any potential partial state on login failure
            return { success: false, msg: err.response.data.msg }; // Return error message
        };
    };
        // Function to handle Logout

        const logout = () => {
            localStorage.removeItem('token');
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
            // Optional: Redirect to login page after logout
            Navigate('/login'); // You'd need to import useNavigate and use it here
        };

        // Provide the state and functions through the context
        const authContextValue = {
            isAuthenticated,
            token,
            user,
            loading, // Provide loading state
            login,
            logout,
        };
    return (
        <AuthContext.Provider value={authContextValue}>
            {/* Only render children when loading is complete */}
            {!loading && children}
            {loading && <p>Loading user data...</p>}{/* Optional loading indicator */}
        </AuthContext.Provider>
    );
};

// Custom hook to easily access the auth context
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export {AuthContext}