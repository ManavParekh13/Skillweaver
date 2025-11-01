// frontend/src/Pages/RegisterPage.jsx

import React, { useState } from 'react';
import api from '../utils/api.js';
import { useNavigate, Link, NavLink } from 'react-router-dom'; // Import NavLink
import './Form.css'; // <-- 1. IMPORT YOUR CSS

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  // Note: Your design shows "Confirm Password" but our backend doesn't use it.
  // We'll keep the logic simple, but you can add it if you like.

  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      await api.post('/auth/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">

        <div className="form-header">
          <h1>Join SkillWeaver</h1>
          <p>Create an account to start swapping.</p>
        </div>

        <div className="form-toggle">
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="aisha@example.com"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="password123"
              required
              minLength="6"
            />
          </div>
          
          <button type="submit" className="form-button">Create Account</button>
          
          {error && <p className="form-error">{error}</p>}
          
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;