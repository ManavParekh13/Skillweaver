// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; // <-- 1. IMPORT YOUR NEW CSS

// Import Pages
import HomePage from './Pages/HomePage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import DashboardPage from './Pages/DashboardPage.jsx';
import UserDashboard from './Pages/UserDashboard.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import OfferSkillPage from './Pages/OfferSkillPage.jsx';

// Import Components
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      {/* 2. This new div is our main flex container */}
      <div className="app-container">
      
        <Navbar />
        
        {/* 3. This 'main' tag wraps your content and grows */}
        <main className="content-wrap">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse-skills" element={<DashboardPage />} />

            {/* --- Protected Routes --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/offer-skill" element={<OfferSkillPage />} />
            </Route>
          </Routes>
        </main>
        
        <Footer />
        
      </div>
    </BrowserRouter>
  );
}

export default App;