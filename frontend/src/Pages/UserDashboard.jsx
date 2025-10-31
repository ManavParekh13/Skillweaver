// frontend/src/Pages/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './UserDashboard.css';

function UserDashboard() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  // 1. Fetch both the user's profile and their swaps
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch profile to get user's ID and name
        const profileRes = await api.get('/profile/me');
        setProfile(profileRes.data);
        
        // Fetch all swaps for this user
        const swapsRes = await api.get('/api/swaps/me');
        setSwaps(swapsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Click handlers for Accept/Decline
  const handleSwapAction = async (id, newStatus) => {
    try {
      // Send the update to the API
      const res = await api.put(`/api/swaps/${id}`, { status: newStatus });
      
      // Update the state locally to avoid a full reload
      setSwaps(swaps.map(swap => (swap._id === id ? res.data : swap)));
    } catch (err) {
      console.error(err);
      alert(`Failed to ${newStatus} swap.`);
    }
  };

  if (loading || !profile) {
    return <div>Loading Dashboard...</div>;
  }

  // 3. Filter the swaps into different categories
  const newRequests = swaps.filter(
    s => s.status === 'pending' && s.provider._id === profile._id
  );
  const ongoingExchanges = swaps.filter(s => s.status === 'accepted');
  const swapHistory = swaps.filter(
    s => s.status === 'completed' || s.status === 'declined'
  );

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-welcome">Welcome back, {profile.username}!</h1>

      <div className="dashboard-grid">
        {/* --- Main Column --- */}
        <div className="dashboard-main">
          
          {/* --- New Requests --- */}
          <h2>New Swap Requests</h2>
          {newRequests.length === 0 ? (
            <p>No new swap requests.</p>
          ) : (
            newRequests.map(swap => (
              <div key={swap._id} className="request-card">
                <div>
                  <p>
                    <strong>{swap.requester.username}</strong> is requesting your <span className="skill">{swap.skillRequested}</span> skill in exchange for <span className="skill">{swap.skillOffered}</span>.
                  </p>
                </div>
                <div className="request-actions">
                  <button className="btn-accept" onClick={() => handleSwapAction(swap._id, 'accepted')}>Accept</button>
                  <button className="btn-decline" onClick={() => handleSwapAction(swap._id, 'declined')}>Decline</button>
                </div>
              </div>
            ))
          )}

          {/* --- Ongoing Exchanges --- */}
          <h2 style={{ marginTop: '2rem' }}>Ongoing Exchanges</h2>
          {ongoingExchanges.length === 0 ? (
            <p>No ongoing exchanges.</p>
          ) : (
            ongoingExchanges.map(swap => (
              <div key={swap._id} className="swap-card">
                Swap for <strong>{swap.skillRequested}</strong> with <strong>
                  {/* Show the *other* user's name */}
                  {swap.provider._id === profile._id ? swap.requester.username : swap.provider.username}
                </strong>
                {/* Progress bar is static for mini-project */}
                <p>In Progress</p>
                <div className="progress-bar"><div style={{ width: '50%' }}></div></div>
              </div>
            ))
          )}

          {/* --- Swap History --- */}
          <h2 style={{ marginTop: '2rem' }}>Swap History</h2>
          {swapHistory.length === 0 ? (
            <p>No completed or declined swaps.</p>
          ) : (
            swapHistory.map(swap => (
              <div key={swap._id} className="request-card">
                <p>
                  <strong>{swap.status.toUpperCase()}:</strong> Swap with <strong>
                  {swap.provider._id === profile._id ? swap.requester.username : swap.provider.username}
                  </strong> for <span className="skill">{swap.skillRequested}</span>.
                </p>
              </div>
            ))
          )}
        </div>

        {/* --- Sidebar (simplified) --- */}
        <div className="dashboard-sidebar">
          <h2>Your Stats</h2>
          <div className="stat-card">
            <div className="label">Completed Swaps</div>
            <div className="value">{swaps.filter(s => s.status === 'completed').length}</div>
          </div>
          <div className="stat-card">
            <div className="label">Your Rating</div>
            <div className="value">Not Rated</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;