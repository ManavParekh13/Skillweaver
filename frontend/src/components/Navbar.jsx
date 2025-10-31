// frontend/src/components/Navbar.jsx

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Navbar.css'; // <-- 1. IMPORT YOUR NEW CSS FILE

function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">SkillWeaver</Link>

      {/* --- Main Links --- */}
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/browse-skills">Browse Skills</Link> 
        {/* Show "Offer a Skill" and "Profile" only if logged in */}
        {token && <Link to="/offer-skill">Offer a Skill</Link>}
        {token && <Link to="/profile">Profile</Link>}
      </div>

      {/* --- Actions --- */}
      <div className="navbar-actions">
        {token ? (
          <>
            <Link to="/dashboard" className="btn-login">Dashboard</Link>
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