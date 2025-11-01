// frontend/src/Pages/DashboardPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Dashboard.css';

function DashboardPage() {
  const { token } = useAuth();
  const [offerings, setOfferings] = useState([]); // Renamed from 'users'
  const [loading, setLoading] = useState(true);

  // --- State for Filters ---
  const [searchTerm, setSearchTerm] = useState('');
  const [level, setLevel] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/public/users');
        
        // --- THIS IS THE NEW LOGIC ---
        // 1. Create a flat array of "skill offerings" from the user data
        const allOfferings = [];
        response.data.forEach(user => {
          // 2. Create one card for EACH skill a user teaches
          user.skillsToTeach.forEach(skillObj => {
  allOfferings.push({
    _id: `${user._id}_${skillObj.skill}`,
    skill: skillObj.skill,
    level: skillObj.level,
    user: { // <-- THIS IS THE IMPORTANT PART
      _id: user._id, // <-- MAKE SURE THIS ID IS HERE
      username: user.username,
      bio: user.bio,
      skillsToLearn: user.skillsToLearn}
            });
          });
        });
        setOfferings(allOfferings);
        // --- END OF NEW LOGIC ---

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  // --- Filtering Logic (now filters offerings) ---
  const filteredOfferings = offerings.filter(offering => {
    // Filter by Level
    if (level && offering.level !== level) {
      return false;
    }

    // Filter by Search Term
    const term = searchTerm.toLowerCase();
    const hasMatchingUser = offering.user.username.toLowerCase().includes(term);
    const hasMatchingSkill = offering.skill.toLowerCase().includes(term);

    if (searchTerm && !hasMatchingUser && !hasMatchingSkill) {
      return false;
    }
    
    return true; 
  });

  // --- Gating Logic ---
  const offeringsToShow = token ? filteredOfferings : filteredOfferings.slice(0, 20);

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Available Skills</h1>
        <p>Discover amazing skills shared by our community members.</p>
      </div>

      {/* --- Functional Filter Bar --- */}
      <div className="filter-bar">
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search skills or users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="filter-select"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Expert">Expert</option>
        </select>
        <select className="filter-select" disabled>
          <option value="">Location (coming soon)</option>
        </select>
      </div>

      {/* --- Skill Grid --- */}
      {loading ? (
        <div>Loading skills...</div>
      ) : (
        <div className="skill-grid">
          {offeringsToShow.length === 0 ? (
            <p>No skills found. Try a different search!</p>
          ) : (
            // Map over the new 'offeringsToShow' array
            offeringsToShow.map(offering => (
              <SkillCard key={offering._id} offering={offering} />
            ))
          )}
        </div>
      )}

      {/* --- "See More" Button --- */}
      {!token && filteredOfferings.length > 20 && (
        <div className="see-more-container">
          <p>Want to see all {filteredOfferings.length} results?</p>
          <Link to="/register" className="see-more-btn">
            Register for free to see more
          </Link>
        </div>
      )}
    </div>
  );
}

// --- Skill Card Component (Updated) ---
function SkillCard({ offering }) {
  const { token } = useAuth();
  const navigate = useNavigate();

  const handleRequestSwap = async () => {
    // 1. Get the skill the requester wants to offer
    const skillOffered = prompt(
      `What skill will you offer ${offering.user.username} in return for ${offering.skill}?`
    );

    if (!skillOffered) {
      alert('You must specify a skill to offer.');
      return;
    }

    try {
      // 2. Send the request to our new API endpoint
      await api.post('/api/swaps', {
        providerId: offering.user._id,
        skillRequested: offering.skill,
        skillOffered: skillOffered
      });

      // 3. Success!
      alert('Swap request sent successfully!');
      navigate('/dashboard'); // Go to your private dashboard

    } catch (err) {
      console.error(err);
      alert('Failed to send swap request.');
    }
  };

  const levelClass = offering.level.toLowerCase();

  return (
    <div className="skill-card">
      <div className="skill-card-header">
        <div>
          <h3 className="skill-card-title">{offering.skill}</h3>
          <span className={`skill-level ${levelClass}`}>{offering.level}</span>
        </div>
      </div>

      <p className="skill-card-desc">{offering.user.bio || 'No bio provided.'}</p>
      <div className="skill-card-user">
        <div className="skill-card-user-info">
          <span>{offering.user.username}</span>
        </div>
      </div>
      <div className="skill-card-looking">
        <span>Looking for:</span> {offering.user.skillsToLearn.join(', ') || 'Not specified'}
      </div>

      <div className="skill-card-footer">
        {token ? (
          // Logged IN: Show a functional button
          <button className="skill-swap-btn" onClick={handleRequestSwap}>
            Request Swap
          </button>
        ) : (
          // Logged OUT: Link to login page
          <Link to="/login" className="skill-swap-btn">
            Login to Request Swap
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;