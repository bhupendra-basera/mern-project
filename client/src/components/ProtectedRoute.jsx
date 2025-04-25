import React , {useContext} from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx'; // Import AuthContext

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useContext(AuthContext);

    // While authentication status is loading, render nothing or a loading spinner
    if (loading) {
        return <p>Loading...</p>; // Or a more sophisticated loading component
    }

    // If not authenticated and loading is complete, redirect to the login page
    if (!isAuthenticated) {
        // Navigate component handles the redirection
        // 'replace' ensures the login page replaces the history entry,
        // so the user doesn't hit the back button to get back to the protected page.
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the child components (the protected page)
    return children;
};

export default ProtectedRoute;