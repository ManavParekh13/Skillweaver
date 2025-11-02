// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css'; 
import logo from '../assets/logo.png'; // <-- 1. IMPORT YOUR LOGO

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      
      {/* --- 2. REPLACE THE BRAND TEXT WITH AN IMG --- */}
      <Link to="/" className="navbar-brand">
        <img src={logo} alt="SkillWeaver Logo" className="navbar-logo" />
        SkillWeaver
      </Link>

      {/* --- Main Links --- */}
      <div className="navbar-links">
        {token ? (
          <>
            <Link to="/dashboard">Home</Link>
            <Link to="/browse-skills">Browse Skills</Link> 
            <Link to="/offer-skill">Offer a Skill</Link>
          </>
        ) : (
          <>
            <Link to="/">Home</Link>
            <Link to="/browse-skills">Browse Skills</Link> 
          </>
        )}
      </div>

      {/* --- Actions --- */}
      <div className="navbar-actions">
        {token ? (
          <>
            <Link to="/profile" className="btn-login">Profile</Link>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </>
        ) : (
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