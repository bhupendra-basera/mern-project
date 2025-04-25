import React,{ useEffect, useState } from 'react'; // Import useEffect and useState
import api from '../utils/api'; // Import our configured Axios instance

const CausesPage = () => {
    const [causes, setCauses] = useState([]); // State to store the list of causes
    const [loading, setLoading] = useState(true); // State to manage loading status
    const [error, setError] = useState(null); // State to manage potential errors

    // useEffect hook to fetch data when the component mounts 
    useEffect(() => {
        const fetchCauses = async () => {
            try{
                const res = await api.get('/causes'); // Make GET request to backend causes endpoint
                setCauses(res.data); // Update state with fetched causes
                setLoading(false); // Set loading to false
            } catch (err) {
                console.error('Error fetching causes:', err);
                setError(`Failed to load causes. Please try again later.`); // Set error message
                setLoading(false); // Set loading to false even on error
            }
        };
        fetchCauses(); // Call the fetch function
    },[]); // Empty dependency array means this effect runs only once on mount

    // Render different content based on loading, error, and data
    if(loading) {
        return <div>Loading causes...</div>; // Loading indicator
    }
    
    if(error) {
        return <div style={{ color: 'red' }}>{error}</div>; // Display error message
    }

    if(causes.length === 0) {
        return <div>No causes found at the moment.</div>; // Message if no causes
    }

    return (
        <div>
            <h2>Our Causes</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {/* Map over the causes array and display each one */}
                {causes.map(cause => (
                    <div key={cause._id} style={{ border: '1px solid #ccc', padding: '15px' , borderRadius: '8px' }}>
                        <h3>{cause.title}</h3>
                        <p>{cause.description.substring(0,100)}...</p> {/* Display snippet */}
                        <img src={cause.image} alt={cause.title} style={{ width: '100%', height: '200px', objectFit: 'cover', marginBottom: '10px'}} />
                        <p>Target: ₹{cause.targetAmount}</p>
                        <p>Raised: ₹{cause.raisedAmount}</p>
                        {/* TODO: Add a "Learn More" or "Donate" button/link */}
                        </div>
                ))}
            </div>
        </div>
    );
};
export default CausesPage;