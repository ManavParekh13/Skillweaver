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
import EditProfilePage from './Pages/EditProfilePage.jsx'; 
import ProfilePage from './Pages/ProfilePage.jsx';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Footer from './components/Footer.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import TermsPage from './Pages/TermsPage.jsx';
import AboutPage from './Pages/AboutPage.jsx';

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
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/about" element={<AboutPage />} />

            {/* --- PROTECTED ROUTES --- */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/offer-skill" element={<OfferSkillPage />} />
              <Route path="/profile" element={<ProfilePage />} />
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