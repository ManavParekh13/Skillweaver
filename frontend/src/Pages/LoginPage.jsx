// frontend/src/Pages/LoginPage.jsx

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, NavLink } from 'react-router-dom'; // Import NavLink
import { useAuth } from '../context/AuthContext.jsx';
import './Form.css'; // <-- 1. IMPORT YOUR NEW CSS

function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('/api/auth/login', formData);
      login(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">

        <div className="form-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to continue your journey.</p>
        </div>

        <div className="form-toggle">
          <NavLink to="/register">Register</NavLink>
          <NavLink to="/login">Login</NavLink>
        </div>

        <form onSubmit={handleSubmit}>
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
            />
          </div>
          
          <button type="submit" className="form-button">Login</button>
          
          {error && <p className="form-error">{error}</p>}
          
        </form>
      </div>
    </div>
  );
}

export default LoginPage;