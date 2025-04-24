import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route

// Import placeholder components (you'll and actual content later)
import HomePage from './pages/HomePage';
import SignupPage  from './pages/SignupPage';
import LoginPage from './pages/LoginPage';

// Import layout components (placeholders for now)
import Navbar from './components/Navbar';
import Footer from './components/Footer';



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      {/* Use a React Fragment */}
      <Navbar /> {/* Navbar will appear on all pages */}

      {/* Define our application routes */}
      <Routes>
        {/* Route for the Home page */}
        <Route path="/" element={<HomePage/>}/>

        {/* Route for the Signup page */}
        <Route path="/signup" element={<SignupPage />} />

        {/* Route for the Login page */}
        <Route path="/login" element={<LoginPage />} />

        {/* TODO: Add routes for Donate, Profile, etc. later */}
      </Routes>
      <Footer /> {/* Footer will appear on all routed pages */}
    </>
    );
  }
export default App
