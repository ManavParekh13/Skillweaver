// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; 

// Import Pages
import HomePage from './Pages/HomePage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import DashboardPage from './Pages/DashboardPage.jsx';     
import UserDashboard from './Pages/UserDashboard.jsx'; 
import OfferSkillPage from './Pages/OfferSkillPage.jsx'; 
// --- 1. IMPORT YOUR RENAMED PAGE ---
import EditProfilePage from './Pages/EditProfilePage.jsx'; 
// --- 2. IMPORT THE NEW PAGE WE WILL CREATE ---
import ProfilePage from './Pages/ProfilePage.jsx';

// Import Components
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Navbar />
        <main className="content-wrap">
          <Routes>
            {/* --- Public Routes --- */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/browse-skills" element={<DashboardPage />} />

            {/* --- 3. UPDATE PROTECTED ROUTES --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/offer-skill" element={<OfferSkillPage />} />
              {/* "/profile" IS NOW THE "VIEW" PAGE */}
              <Route path="/profile" element={<ProfilePage />} />
              {/* "/profile/edit" IS THE "EDIT" PAGE */}
              <Route path="/profile/edit" element={<EditProfilePage />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;