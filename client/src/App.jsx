import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
// Import placeholder components (you'll and actual content later)
import HomePage from './pages/HomePage';
import SignupPage  from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage'; // Import ProfilePage
import CausesPage from './pages/CausesPage'; // Import CausesPage
import CauseDetailsPage from './pages/CauseDetailsPage'; // Import CauseDetailsPage
// Import layout components (placeholders for now)
import Navbar from './components/Navbar';
import Footer from './components/Footer';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Navbar /> 

      {/* Define our application routes */}
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<HomePage/>}/>

        {/* Route for the Signup page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Route for the Login page */}
        <Route path="/login" element={<LoginPage />} />

        <Route path="/causes" element={<CausesPage />}/>
        <Route path="/causes/:id" element={<CauseDetailsPage />}/>
        <Route path="/profile" element={
          <ProtectedRoute> {/* Wrap the element with ProtectedRoute */}
            <ProfilePage />
          </ProtectedRoute>
          } />
       </Routes>
      <Footer /> {/* Footer will appear on all routed pages */}
    </>
    );
  }
export default App
