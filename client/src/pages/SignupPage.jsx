import React,{useState,useContext, useEffect} from 'react'; // Import useState hook
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import api from '../utils/api'; // Import our configured Axios instance
import { AuthContext } from '../context/AuthContext.jsx';


const SignupPage = () => {
    // State to manage form input values
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password:''
    });
    
    const { username, email, password } = formData; // Destructure form data
    
    const navigate = useNavigate(); // Hook for navigation

    const { isAuthenticated } = useContext(AuthContext); // Get isAuthenticated state

    // Effect to redirect if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            // If authenticated, redirect to the profile page or home
            navigate('/profile', { replace: true }); // Redirect to profile or home
        }
    },[isAuthenticated, navigate]); // Dependency array;
    // Handle input changes
    const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value});

    // Handle form submission
    const onSubmit = async e => { // Use async because we'll make an API call
        e.preventDefault(); // Prevent default form submission (page reload)
        
        try {
            // Make the POST request to the backend signup endpoint
            const res = await api.post('/auth/signup', formData);

            console.log('Signup Success:', res.data); // Log success response
            alert(res.data.msg); // Display a success message (basic alert for now)

            // Redirect to login page after successful signup
            navigate('/login');

        } catch (err) {
            console.error('Signup Error:', err.response.data.msg); // Log error response
            // Display error message to the user
            alert(`Eror: ${err.response.data.msg}`); // Display error message (basic alert)
        }
        };
    return (
        <div>
            <h2>Sign Up</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        name="username" // Name must match the state property
                        value={username}
                        onChange={onChange}
                        required // Basic HTML validation
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email" // Name must match the state property
                        value={email}
                        onChange={onChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor ="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password" // Name should match the state property
                        value={password}
                        onChange={onChange}
                        required
                        minLength="6" // Basic HTML validation matching backend
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
            <p>
                Already have an account? <Link to="/login">Login</Link> { /* Simple link, use Link component later */}
            </p>
        </div>
    );
};

export default SignupPage;