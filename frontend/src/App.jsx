// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

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
import ProtectedRoute from './components/ProtectedRoute.jsx'; // 1. IMPORT IT
import Footer from './components/Footer.jsx';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="App">
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
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;