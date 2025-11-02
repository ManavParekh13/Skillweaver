// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css'; 

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      
      {/* --- Brand --- */}
      <Link to="/" className="navbar-brand">SkillWeaver</Link>

      {/* --- Main Links --- */}
      <div className="navbar-links">
        {token ? (
          // --- LOGGED-IN LINKS ---
          <>
            {/* 1. "Home" now points to /dashboard */}
            <Link to="/dashboard">Home</Link>
            <Link to="/browse-skills">Browse Skills</Link> 
            <Link to="/offer-skill">Offer a Skill</Link>
            {/* We remove "Profile" from here, since it's on the right */}
          </>
        ) : (
          // --- LOGGED-OUT LINKS ---
          <>
            <Link to="/">Home</Link>
            <Link to="/browse-skills">Browse Skills</Link> 
          </>
        )}
      </div>

      {/* --- Actions --- */}
      <div className="navbar-actions">
        {token ? (
          // --- LOGGED-IN ACTIONS ---
          <>
            {/* 2. "Dashboard" button is now a "Profile" button */}
            <Link to="/profile" className="btn-login">Profile</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
          // --- LOGGED-OUT ACTIONS ---
          <>
            <Link to="/login" className="btn-login">Sign In</Link>
            <Link to="/register" className="btn-join">Join Now</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;