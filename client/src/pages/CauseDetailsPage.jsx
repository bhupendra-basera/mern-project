import React, {useEffect, useState, useContext} from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import api from '../utils/api'; // Import our configured Axios instance
import { AuthContext } from '../context/AuthContext.jsx'; // Import Authcontext

const CauseDetailsPage = () => {
    const { id } = useParams(); // Get the 'id' parameter from the URL
    const [cause, setCause] = useState(null);
    const [loading, setloading] = useState(true);
    const [ error, setError] = useState(null);

    // State for the donation amount input
    const [donationAmount, setDonationAmount] = useState('');

    //Access authentication state from context
    const { isAuthenticated } = useContext(AuthContext);

    // useEffect hook to fetch data when the component mounts or the ID changes
    useEffect(() => {
        const fetchCause = async () => {
            try{
                setloading(true); // Set loading to true when fetching starts
                // Make GET request to the backend endpoint for a single cause
                const res = await api.get(`/causes/${id}`);
                setCause(res.data); // Update state whith the fetched caused data
                setloading(false); // Set loading to false
            } catch (err) {
                console.error('Error fetching cause details:', err);
                setError('Failed to load cause details. Please check the URL.'); // Set error message
                setloading(false); // Set loading to false even on error
                setCause(null); // Clear cause data on error
            }
        };
        // Only fetch if an ID is available in the URL
        if(id){
            fetchCause();
        } else {
            // Handle case where ID is missing from URL (shouldn't happen with our route setup)
            setError('Cause ID is missing');
            setloading(false);
        }
    },[id]); // dependency array: re-run this effec whenever the 'id' parameter changes

    // Handle donation amount input change
    const handleAmountChange = (e) => {
        console.log('e--',e.target.value)
        setDonationAmount(e.target.value);
    }

    // Handle donate form submission
    const handleDonateSubmit = async (e) => {
        e.preventDefault();
    

    // Basic validation for amount
    if(!donationAmount || parseFloat(donationAmount) <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    try{
        // Data to send to the backend donation endpoint
        const donationData = {
            causeId: id, // Use the cause ID from URL params
            amount: parseFloat(donationAmount), // Ensure amount is a number
            currency: 'INR', // or get from user selection later
            isAnonymous: false // Or get form user selection later
        };

        // Make the POST request to the backend to record the pending donation
        const res = await api.post('/donations',donationData);

        console.log('Donation initiated (pending):',res.data);
        alert('Donation initiated successfully! (Next step: Payment)'); // Success message

        // TODO: In a real application , after this success, you would
        // Now integrate with the payment gateway API using the pending donation ID
        // or redirect the user to the payment gateway's page.
        // For now, a success alert confirms the backend record was created.
        
        setDonationAmount(''); // Clear the input field
    } catch (err) {
        console.error('Error initiating donation:', err.response?.data?.msg || err.message);
        // Display error message from backend or generic error
        alert(`Failed to initiate donation: ${err.response?.data?.msg || 'Server Error'}`);
    }
    };
    // Render different content based on  loading, error, and data
    if( loading) {
        return <div>Loading cause details...</div>;
    }

    if (error) {
        return <div style={{ color: 'red'}}>{error}</div>;
    }

    // If no cause is found after loading (e.g., invalid ID that didn't throw a CastError)

    if (!cause) {
        return <div> Cause not found.</div>;
    }

    return(
        <div>
        <h2>{cause.title}</h2>
        <div style={{ border: '1px solid #ccc', padding:'20px', borderRadius:'8px',margin: '20px 0'}}>
            <img src={cause.image} alt={cause.title} style={{maxWidth: '100%', height: 'auto', display: 'block',marginBottom:'20px'}}/>
            <p><strong>Description:</strong>{cause.description}</p>
            <p><strong>Target Amount:</strong>₹{cause.targetAmount}</p>
            <p><strong>Raised Amount:</strong>₹{cause.raisedAmount}</p>
            {/* You an calculate and display the progress percentage here */}
            <p><strong>Progress:</strong>{((cause.raisedAmount/cause.targetAmount) * 100).toFixed(2)}%</p>

            { /* --- Donate Section (visible only if authenticated) --- */}
            {isAuthenticated && ( // Conditionally render based on authentication state
            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                <h3>Make a Donation</h3>
                <form onSubmit={handleDonateSubmit}>
                    <div>
                        <label htmlFor="donationAmount">Amount (INR):</label>
                        <input 
                            type="number" // Use number type for amount
                            id="donationAmount"
                            value={donationAmount}
                            onChange={handleAmountChange}
                            required
                            min="1" // Minimum value matching backend validation
                            step ="0.01" // Allow decimal values
                            style = {{ marginLeft: '10px', padding: '8px'}}
                            />
                    </div>
                    <button type="submit" style={{ marginTop: '15px', padding:'10px 20px', cursor: 'pointer' }}>
                        Donate Now
                    </button>
                </form>
                {/* TODO: Add options for anonymous donation, recurring, etc. */}
            </div>)
            }
            {/* --- End Donate Section --- */}

            {/* TODO: Add Comments section */}
        </div>
        { /* TODO: Add a back button or link to the Causes list */}
        </div>
    );
};

export default CauseDetailsPage