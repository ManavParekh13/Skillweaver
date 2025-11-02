// frontend/src/Pages/ProfilePage.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { Link } from 'react-router-dom';
import './ProfilePage.css'; // <-- Import your new CSS

// Helper function to get initials
const getInitials = (name) => {
  if (!name) return '??';
  const parts = name.split(' ');
  return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : ''))
    .toUpperCase();
};

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('swaps'); // 'swaps' or 'skills'

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile and swaps at the same time
        const [profileRes, swapsRes] = await Promise.all([
          api.get('/profile/me'),
          api.get('/swaps/me')
        ]);
        setUser(profileRes.data);
        setSwaps(swapsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !user) {
    return <div>Loading profile...</div>;
  }

  // --- Filter Swaps ---
  // This is the logic from your UserDashboard page
  const ongoingExchanges = swaps.filter(s => s.status === 'accepted');

  // Format join date
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
          <Link to="/profile/edit" className="btn-edit-profile">
            Edit Profile
          </Link>
        </div>
      </div>
      
      {/* --- User Bio (Read-Only) --- */}
      <div className="profile-bio">
        {user.bio || "No bio... Click 'Edit Profile' to add one."}
      </div>

      {/* --- Stats Bar (Simplified) --- */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="value">{user.skillsToTeach.length}</div>
          <div className="label">Skills You Teach</div>
        </div>
        <div className="stat-card">
          <div className="value">{user.skillsToLearn.length}</div>
          <div className="label">Skills You're Learning</div>
        </div>
      </div>

      {/* --- Content Tabs --- */}
      <div className="profile-content">
        <div className="profile-tabs">
          <div 
            className={`tab ${activeTab === 'swaps' ? 'active' : ''}`}
            onClick={() => setActiveTab('swaps')}
          >
            Active Swaps
          </div>
          <div 
            className={`tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </div>
          <div className="tab">Reviews (Coming Soon)</div>
        </div>
        
        {/* --- Tab Content --- */}
        <div className="profile-tab-content">

          {/* --- Active Swaps Tab --- */}
          {activeTab === 'swaps' && (
            <div>
              <h3>Current Skill Swaps</h3>
              {ongoingExchanges.length === 0 ? (
                <p>No ongoing exchanges.</p>
              ) : (
                ongoingExchanges.map(swap => (
                  <div key={swap._id} className="swap-card">
                    Swap for <strong>{swap.skillRequested}</strong> with <strong>
                      {swap.provider._id === user._id ? swap.requester.username : swap.provider.username}
                    </strong>
                    <div className="progress-bar"><div style={{ width: '50%' }}></div></div>
                  </div>
                ))
              )}
            </div>
          )}
          
          {/* --- Skills Tab --- */}
          {activeTab === 'skills' && (
            <div className="skill-list-container">
              <div>
                <h3>Skills You Can Teach</h3>
                <ul className="skill-list-tab">
                  {user.skillsToTeach.length === 0 ? (
                    <li>No skills to teach yet.</li>
                  ) : (
                    user.skillsToTeach.map((s, i) => (
                      <li key={i}>
                        <strong>{s.skill}</strong> ({s.level})
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <div>
                <h3>Skills You Want to Learn</h3>
                <ul className="skill-list-tab">
                  {user.skillsToLearn.length === 0 ? (
                    <li>No skills to learn yet.</li>
                  ) : (
                    user.skillsToLearn.map((skill, i) => (
                      <li key={i}><strong>{skill}</strong></li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ProfilePage;