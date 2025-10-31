// frontend/src/Pages/OfferSkillPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import './Form.css'; // Use this for the main card layout
import './ProfilePage.css'; // Use this for the form inputs

function OfferSkillPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Form fields
  const [skillName, setSkillName] = useState('');
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [skillsDesired, setSkillsDesired] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');

  const navigate = useNavigate();

  // 1. Load the user's current data to pre-fill the form
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
        setBio(res.data.bio || '');
        setLocation(res.data.location || '');
        setSkillsDesired(res.data.skillsToLearn.join(', '));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // 2. Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 1. Prepare the new data
      const newSkillOffering = { skill: skillName, level: skillLevel };
      const updatedSkillsToTeach = [...profile.skillsToTeach, newSkillOffering];
      const updatedSkillsToLearn = skillsDesired.split(',').map(s => s.trim()).filter(s => s);

      // 2. Send the update
      await api.put('/profile/me', {
        bio: bio,
        location: location,
        skillsToLearn: updatedSkillsToLearn,
        skillsToTeach: updatedSkillsToTeach
      });

      // 3. Success
      alert('New skill offered successfully!');
      navigate('/dashboard'); // Go to their private dashboard

    } catch (err) {
      console.error(err);
      alert('Failed to offer skill.');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Offer a Skill</h1>
          <p>Tell us what you're passionate about teaching or sharing.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Skill Name */}
          <div className="form-group">
            <label>Skill Name</label>
            <input 
              type="text" 
              className="skill-input"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
              placeholder="e.g. Guitar Lessons, MERN Stack"
              required
            />
          </div>
          {/* Proficiency Level */}
          <div className="form-group">
            <label>Your Proficiency Level</label>
            <select
              className="skill-level-select"
              value={skillLevel}
              onChange={(e) => setSkillLevel(e.target.value)}
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Expert</option>
            </select>
          </div>
          {/* Skills Desired in Return */}
          <div className="form-group">
            <label>Skills Desired in Return (separate with commas)</label>
            <input 
              type="text" 
              className="skill-input"
              value={skillsDesired}
              onChange={(e) => setSkillsDesired(e.target.value)}
              placeholder="e.g. Photography, Graphic Design"
            />
          </div>
          {/* Location */}
          <div className="form-group">
            <label>Your Location (City/Area)</label>
            <input 
              type="text" 
              className="skill-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Mumbai, New York"
            />
          </div>
          {/* About Your Offer */}
          <div className="form-group">
            <label>About Your Offer (updates your main bio)</label>
            <textarea
              className="profile-bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about your skill..."
            />
          </div>
          
          <button type="submit" className="form-button">Submit Your Offer</button>
        </form>
      </div>
    </div>
  );
}

export default OfferSkillPage;