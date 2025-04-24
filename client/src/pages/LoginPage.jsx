import React,{useState} from 'react';
// We'll add API call logic and redirection here later


const LoginPage = () => {

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;
    
    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = e => {
        e.preventDefault();
        console.log('Login Form Submitted:', formData);
        // TODO: Add API call logic here
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
                Don't have an account? <a href="/signup">Sign Up</a> {/*Simple link, use Link component later */}
            </p>
        </div>
    );
};

export default LoginPage;