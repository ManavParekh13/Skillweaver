// frontend/src/Pages/HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css'; 
// --- 1. IMPORT YOUR ICONS ---
import findPartnerIcon from '../assets/find-partner-icon.png';
import growSkillIcon from '../assets/grow-skill-icon.png';
import negotiateIcon from '../assets/negotiate-icon.png';

function HomePage() {
  return (
    <div className="home-page">
      
      {/* --- Hero Section --- */}
      <section className="hero">
        <h1>Exchange Skills, Not Money.</h1>
        <p>Connect with your local community to barter your skills and learn something new.</p>
        <Link to="/register" className="hero-button">
          Offer a Skill Today
        </Link>
      </section>

      {/* --- Features Section --- */}
      <section className="features">
        <div className="container">
          <h2>What is SkillWeaver?</h2>
          <p className="features-intro">
            SkillWeaver is a non-monetary platform built to foster community and collaborative learning.
            We believe everyone has a skill to share and something new to learn.
          </p>          
          <div className="features-grid">
            
            {/* --- 2. ADD IMG TAGS TO CARDS --- */}
            
            {/* Card 1 */}
            <div className="feature-card">
              <img src={findPartnerIcon} alt="Find a Partner" className="feature-icon" />
              <h3>Find a Partner</h3>
              <p>Browse a rich database of skills and connect with members in your area.</p>
            </div>
            
            {/* Card 2 */}
            <div className="feature-card">
              {<img src={negotiateIcon} alt="Negotiate Swap" className="feature-icon" />}
              <h3>Negotiate Your Swap</h3>
              <p>Use our in-app chat to discuss terms, schedule, and agree on a fair trade.</p>
            </div>
            
            {/* Card 3 */}
            <div className="feature-card">
              <img src={growSkillIcon} alt="Grow Your Skills" className="feature-icon" />
              <h3>Grow Your Skills</h3>
              <p>Complete a successful swap, receive a rating, and build your reputation.</p>
            </div>
            
          </div>
        </div>
      </section>

      {/* --- Call to Action (CTA) Section --- */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p className="features-intro">
            Join the SkillWeaver community and unlock a world of possibilities. It's free, easy, and rewarding.
          </p>
          <Link to="/register" className="hero-button">Sign Up and Offer a Skill</Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;