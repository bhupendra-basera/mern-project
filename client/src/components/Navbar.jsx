import React, { useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import { AuthContext } from '../context/AuthContext.jsx'; // Import Authcontext


const Navbar = () => {
    // Access authentication state and functions from  the context
    
    const { isAuthenticated, user, logout } = useContext(AuthContext);
    
    const navigate = useNavigate(); // Hook for navigation after logout

    // Handle logout action
    const handleLogout = () => {
        logout(); // Call the logout function from context
        navigate('/login'); // Redirect to login page after logout
    };

    // Links to show when user is NOT authenticated
    const guestLinks =(
        <ul>
            <li><Link to="/causes">Causes</Link></li> {/* Link to causes page (we'll build this) */}
            <li><Link to="/signup">Sign Up</Link></li>
            <li><Link to="/Login">Login</Link></li>
            {/* TODO: Add link to Contact Us page */}
        </ul>
    );
    // Links to show when user is authenticated
    const authLinks = (
        <ul>
            <li><Link to="/causes">Causes</Link></li>
            <li><Link to="/profile">Welcome, {user ? user.username : 'User'}</Link></li> {/* Link to profile page */}
            {/* Use a button or span with click handler for logout */}
            <li>
                <span onClick={handleLogout} style={{ cursor: 'pointer'}}>
                    Logout
                </span>
            </li>
            {/* TODO: Add link to Contact Us page */}
        </ul>
    )
    return (
        <nav style={{ background: '#f0f0f0', padding: '10px' , display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} >
            <h1><Link to="/">Donation App</Link></h1> {/* Logo/Site Title linking to Home */}
            {/* Conditional rendering based on isAuthenticated */}
            {isAuthenticated ? authLinks : guestLinks}
        </nav>
    );
};

export default Navbar;