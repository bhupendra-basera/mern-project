import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.jsx'; // Import AuthContext 

const ProfilePage = () => {
    // Access the user object from the context
    const { user, loading } = useContext(AuthContext);

    // While user data is loading, show a loading message
    // (This case might be rare if ProtectedRoute is used, but good practice)
    if (loading) {
        return <p>Loading profile...</p>;
    }

    // If user is null ( shouldn't happen if protected route works, but defensive)
    if (!user) {
        return <p>User data not available.</p>;
    }
    
    return (
        <div>
            <h2>User Profile</h2>
            <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '400px', margin: '20px auto' }}>
                <h3>Welcome, {user.username}!</h3>
                <p><strong>Email:</strong> {user.email}</p>
                {/* Add other user details here if you add them to the User model later */}
                {/* For example, if you add a 'fullName' field: */}
                {/* {user.fullName && <p><strong>Full Name: </strong> {user.fullName}</p>} */}
                {/* TODO: Display donation history here later */}
            </div>
            {/* TODO: Add options to edit profile or view donation history */}
        </div>
    )
}

export default ProfilePage;
