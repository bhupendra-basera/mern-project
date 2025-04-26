import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom'; // Import useParams hook
import api from '../utils/api'; // Import our configured Axios instance

const CauseDetailsPage = () => {
    const { id } = useParams(); // Get the 'id' parameter from the URL
    const [cause, setCause] = useState(null);
    const [loading, setloading] = useState(true);
    const [ error, setError] = useState(null);

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

            {/* TODO: Add Donate button/form, Comments section */}
        </div>
        { /* TODO: Add a back button or link to the Causes list */}
        </div>
    );
};

export default CauseDetailsPage