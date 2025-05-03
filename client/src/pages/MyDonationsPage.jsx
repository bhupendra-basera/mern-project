import React, {useEffect , useState} from 'react';
import api from '../utils/api';  // Import our configured Axios instance
// We don't need AuthContext here just to display,
// but the route should be protected by ProtectedRoute


const MyDonationPage = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(()=>{
        const fetchMyDonations = async () => {
            try{console.log('hellog')
                setLoading(true);
                // Make GET request to the backend endpoint for user's donations
                // Axios interceptor automatically adds the Authorization header
                const res = await api.get('/donations/my');
                setDonations(res.data); // Update state with fetched donations
                console.log('donations: ', res)
                setLoading(false);
                
            } catch (err) {
                console.error('Error fetching user donations: ', err);
                // Check for specific error message from backend middleware if needed
                if (err.response  && (err.response.status === 401 || err.response.status === 403  )){
                    setError('Please login to view your donation history.');
                } else {
                    setError('Failed to load donation history. Please try again later.');
                }
                setLoading(false);
            }
        };
        fetchMyDonations(); // Call the fetch function
    },[]); // Empty dependency array; run once on mount

    // Render different content based on loading, error, and data
    if(loading) {
        return <div> Loading donation history...</div>;
    }

    if(error) {
        return <div style={{color: 'red' }}>{error}</div>;
    }

    if (donations.length === 0) {
        return <div>You have no donation history yet.</div>;
    }
    return (
        <div>
        <h2>My Donation History</h2>
        <div style={{ marginTop: '20px' }} >
            {/* Map over the donations array and display each one */}
            {donations.map(donation => (
                <div key = {donation._id} style={{ border: '1px solid #ccc', padding: '15px', marginBottom: '15px', borderRadius: '8px' }}>
                    <p><strong>Amount:</strong> ₹{donation.amount}</p>
                    {/* Display cause details from populated data  */}
                    {donation.cause && (
                        <div>
                            <p><strong>Cause:</strong>{donation.cause.title}</p>
                            {/* Optional: Display a small image */}
                            {donation.cause.image && <img src= {donation.cause.image} alt={donation.cause.title} style={{ width: '50px',height: 'auto', marginRight:'10px' }} />}
                        </div>
                    )}
                    <p><strong>Date:</strong> {new Date(donation.donatedAt).toLocaleDateString()}</p> {/* Format date */}
                    <p><strong>Status:</strong> {donation.paymentStatus}</p>
                    <p><strong>Anonymous:</strong>{donation.isAnonymous ? 'Yes' : 'No'}</p>
                    {/* TODO: Add links to view invoice/certificate */}
                </div>
            ))}
        </div>
        </div>
    );
};

export default MyDonationPage;