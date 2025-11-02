// frontend/src/Pages/OfferSkillPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom';
import './Form.css';
import './ProfilePage.css';

// --- Lists for our dropdowns ---
const SKILL_LIST = [
  'React', 'JavaScript', 'Node.js', 'Python', 'Guitar', 'Piano', 
  'Cooking', 'Baking', 'Photography', 'Graphic Design', 'Spanish', 
  'French', 'Yoga', 'Public Speaking', 'Marketing', 'SEO', 
  'Project Management', 'Data Analysis'
];
const LOCATION_LIST = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];

function OfferSkillPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // --- Form fields ---
  const [skillName, setSkillName] = useState(SKILL_LIST[0]);
  const [skillLevel, setSkillLevel] = useState('Beginner');
  const [location, setLocation] = useState(LOCATION_LIST[0]);
  const [bio, setBio] = useState('');
  
  // --- CHANGED: "Skills Desired" is now an array and has a helper state ---
  const [skillsDesired, setSkillsDesired] = useState([]);
  const [learnSkillInput, setLearnSkillInput] = useState(SKILL_LIST[0]); // State for the dropdown

  const navigate = useNavigate();

  // Load the user's current data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/profile/me');
        setProfile(res.data);
        setBio(res.data.bio || '');
        setLocation(res.data.location || LOCATION_LIST[0]);
        // --- CHANGED: Set an array, not a string ---
        setSkillsDesired(res.data.skillsToLearn || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newSkillOffering = { skill: skillName, level: skillLevel };
      
      const alreadyHasSkill = profile.skillsToTeach.find(s => s.skill === skillName);
      if (alreadyHasSkill) {
        alert('You are already offering this skill.');
        return;
      }

      const updatedSkillsToTeach = [...profile.skillsToTeach, newSkillOffering];
      
      // --- CHANGED: 'skillsDesired' is already the correct array ---
      await api.put('/profile/me', {
        bio: bio,
        location: location,
        skillsToLearn: skillsDesired, // Just send the array
        skillsToTeach: updatedSkillsToTeach
      });

      alert('New skill offered successfully!');
      navigate('/dashboard'); 

    } catch (err) {
      console.error(err);
      alert('Failed to offer skill.');
    }
  };

  // --- NEW: Helper functions for the "Skills Desired" list ---
  const addLearnSkill = () => {
    if (learnSkillInput && !skillsDesired.includes(learnSkillInput)) {
      setSkillsDesired([...skillsDesired, learnSkillInput]);
    }
  };

  const removeLearnSkill = (skillToRemove) => {
    setSkillsDesired(skillsDesired.filter(skill => skill !== skillToRemove));
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
            <select 
              className="skill-level-select"
              value={skillName}
              onChange={(e) => setSkillName(e.target.value)}
            >
              {SKILL_LIST.map(skill => (
                <option key={skill} value={skill}>{skill}</option>
              ))}
            </select>
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

          {/* --- JSX CHANGE: "Skills Desired" is now a dropdown + tag list --- */}
          <div className="form-group">
            <label>Skills Desired in Return</label>
            <div className="skill-input-group">
              <select
                className="skill-level-select" // Re-using this class
                value={learnSkillInput}
                onChange={(e) => setLearnSkillInput(e.target.value)}
              >
                {SKILL_LIST.map(skill => (
                  <option key={skill} value={skill}>{skill}</option>
                ))}
              </select>
              <button type="button" className="skill-add-btn" onClick={addLearnSkill}>Add</button>
            </div>
            <ul className="skill-list" style={{ marginTop: '1rem' }}>
              {skillsDesired.map((skill, index) => (
                <li key={index} className="skill-tag">
                  {skill}
                  <button type="button" className="skill-remove-btn" onClick={() => removeLearnSkill(skill)}>×</button>
                </li>
              ))}
            </ul>
          </div>
          {/* --- END OF JSX CHANGE --- */}

          {/* Location */}
          <div className="form-group">
            <label>Your Location (City/Area)</label>
            <select 
              className="skill-level-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              {LOCATION_LIST.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
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