import React,{useState , useContext, useEffect} from 'react';
import { useNavigate ,Link} from 'react-router-dom';
import api from '../utils/api'; // Import our configured Axios instance
import { AuthContext } from '../context/AuthContext'; // Import AuthContext


const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    
    const navigate = useNavigate();
    // we'll get the login function from AuthContext here later
    const { login } = useContext(AuthContext); // Use useContext to access context value
    
    const {isAuthenticated} = useContext(AuthContext); // Get isAuthenticated state

    // Effect to redirect if user is already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            // If Authenticated, redirect to the profile page or home
            navigate('/profile', { replace: true }); // Use replace: true fro cleaner history
        }
    }, [isAuthenticated, navigate]); // Dependency array: re-run if isAuthenticated or navigate changes
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();

        const result = await login(email, password); // Use the login function from context

        if(result.success) {
            // Redirection is now handled inside the login function in AuthContext
            // Or you could handle it here if you prefer: navigate('/');
            console.log('Login Successful, redirecting...');
            // Redirecting  to the home page or dashboard upon success
            navigate('/'); // Or elsewhere
        } else{
            alert(`Login failed: ${result.msg}`); // Display error message from context result
        }

        // try{
        //     //Make the POST request to the backend login endpoint
        //     const res = await api.post('/auth/login', formData);

        //     console.log('Login Success:', res.data); // Log success response
        //     // The backend sends back { token: '...' }

        //     // ** Store the JWT ** 
        //     localStorage.setItem('token', res.data.token); // Store token in localStorage
        //     // In a real app, you might also want to fetch the user's profile here

        //     alert("Login successful!"); //Basic success feedback

        //     // Redirect to the home page or  a protected page
        //     navigate('/'); // Or navigate('/dashboard') etc;

        //     // TODO: Update Auth Context state here later
        // } catch (err) {
        //     console.error('Login Error:', err.response.data.msg); // Log error response
        //     alert(`Error: ${err.response.data.msg}`); // Display error message
        // }
    };

    
    
    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={onChange} 
                        required 
                    />
                </div>
                <div>
                    <label htmlFor="password"> Password:</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={onChange}
                        required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign Up</Link> {/*Simple link, use Link component later */}
            </p>
        </div>
    );
};

export default LoginPage;