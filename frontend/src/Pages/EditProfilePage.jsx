// frontend/src/Pages/EditProfilePage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useNavigate } from 'react-router-dom'; 
import './EditProfilePage.css'; 

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ''))
    .toUpperCase();
};

function EditProfilePage() {
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [bio, setBio] = useState('');
  const [skillsToTeach, setSkillsToTeach] = useState([]);
  const [skillsToLearn, setSkillsToLearn] = useState([]);
  const [teachSkill, setTeachSkill] = useState('');
  const [teachLevel, setTeachLevel] = useState('Beginner');
  const [learnSkill, setLearnSkill] = useState('');
  
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get('/profile/me');
        setUser(response.data);
        setBio(response.data.bio || '');
        setSkillsToTeach(response.data.skillsToTeach || []);
        setSkillsToLearn(response.data.skillsToLearn || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/profile/me', {
        bio,
        skillsToTeach,
        skillsToLearn
      });
      alert('Profile Updated!');
      navigate('/profile'); 
    } catch (err)      {
      console.error(err);
      alert('Error updating profile');
    }
  };

  const addTeachSkill = () => {
    if (teachSkill && !skillsToTeach.find(s => s.skill === teachSkill)) {
      setSkillsToTeach([...skillsToTeach, { skill: teachSkill, level: teachLevel }]);
      setTeachSkill('');
      setTeachLevel('Beginner');
    }
  };
  const removeTeachSkill = (skillToRemove) => {
    setSkillsToTeach(skillsToTeach.filter(s => s.skill !== skillToRemove));
  };
  const addLearnSkill = () => {
    if (learnSkill && !skillsToLearn.includes(learnSkill)) {
      setSkillsToLearn([...skillsToLearn, learnSkill]);
      setLearnSkill('');
    }
  };
  const removeLearnSkill = (skillToRemove) => {
    setSkillsToLearn(skillsToLearn.filter(skill => skill !== skillToRemove));
  };


  if (loading || !user) {
    return <div>Loading profile...</div>;
  }

  const joinDate = new Date(user.createdAt).toLocaleDateString('en-US', {
    month: 'long', year: 'numeric'
  });

  return (
    <div className="profile-page">
      
      {/* --- User Header Card --- */}
      <div className="profile-header-card">
        <div className="profile-avatar">{getInitials(user.username)}</div>
        <div className="profile-info">
          <h1>{user.username}</h1>
          <p>{user.email} • Joined {joinDate}</p>
        </div>
        <div className="profile-actions">
          <button className="btn-save" onClick={handleSave}>Save Profile</button>
        </div>
      </div>

      {/* --- Stats Bar (Simplified) --- */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="value">{skillsToTeach.length}</div>
          <div className="label">Skills You Teach</div>
        </div>
        <div className="stat-card">
          <div className="value">{skillsToLearn.length}</div>
          <div className="label">Skills You're Learning</div>
        </div>
      </div>

      {/* --- Content Tabs --- */}
      <div className="profile-content">
        <div className="profile-tabs">
          <div className="tab active">Skills</div>
        </div>
        
        {/* --- Tab Content (Our Form) --- */}
        <div className="profile-tab-content">
          <div className="profile-form-section">
            
            {/* Bio */}
            <div className="profile-card profile-bio">
              <h3>Your Bio</h3>
              <textarea
                name="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            {/* Skills to Teach */}
            <div className="profile-card">
              <h3>Skills You Can Teach</h3>
              <div className="skill-input-group">
                <input type="text" className="skill-input" value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)} placeholder="e.g., React" />
                <select className="skill-level-select" value={teachLevel}
                  onChange={(e) => setTeachLevel(e.target.value)}>
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Expert</option>
                </select>
                <button type="button" className="skill-add-btn" onClick={addTeachSkill}>Add</button>
              </div>
              <ul className="skill-list">
                {skillsToTeach.map((s, index) => (
                  <li key={index} className="skill-tag">
                    {s.skill}
                    <span className="level">({s.level})</span>
                    {/* --- THIS IS THE FIX --- */}
                    <button type="button" className="skill-remove-btn" onClick={() => removeTeachSkill(s.skill)}>×</button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Skills to Learn */}
            <div className="profile-card">
              <h3>Skills You Want to Learn</h3>
              <div className="skill-input-group">
                <input type="text" className="skill-input" value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)} placeholder="e.g., Python" />
                <button type="button" className="skill-add-btn" onClick={addLearnSkill}>Add</button>
              </div>
              <ul className="skill-list">
                {skillsToLearn.map((skill, index) => (
                  <li key={index} className="skill-tag">
                    {skill}
                    <button type="button" className="skill-remove-btn" onClick={() => removeLearnSkill(skill)}>×</button>
                  </li>
                ))}
              </ul>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfilePage;