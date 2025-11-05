// frontend/src/Pages/UserDashboard.jsx

import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import './UserDashboard.css';

function UserDashboard() {
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const profileRes = await api.get('/profile/me');
        setProfile(profileRes.data);
        
        const swapsRes = await api.get('/swaps/me');
        setSwaps(swapsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- UPDATED: Replaced 'handleSwapAction' with two specific functions ---

  const handleAcceptSwap = async (id) => {
    try {
      const res = await api.put(`/swaps/${id}/accept`);
      // Update the swap in our local state
      setSwaps(swaps.map(swap => (swap._id === id ? res.data : swap)));
    } catch (err) {
      console.error(err);
      alert('Failed to accept swap.');
    }
  };
  
  const handleDeclineSwap = async (id) => {
    try {
      const res = await api.put(`/swaps/${id}/reject`);
      // Update the swap in our local state
      setSwaps(swaps.map(swap => (swap._id === id ? res.data : swap)));
    } catch (err) {
      console.error(err);
      alert('Failed to decline swap.');
    }
  };

  // This is your existing function, it is correct
  const handleCompleteSwap = async (id) => {
    if (!window.confirm('Are you sure you want to mark this swap as completed?')) {
      return;
    }
    try {
      const res = await api.put(`/swaps/${id}/complete`);
      setSwaps(swaps.map(swap => (swap._id === id ? res.data : swap)));
    } catch (err) {
      console.error(err);
      alert('Failed to mark swap as complete.');
    }
  };

  if (loading || !profile) {
    return <div>Loading Dashboard...</div>;
  }

  // --- THESE FILTERS ARE NOW CORRECT AND WILL WORK ---
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
        <div className="dashboard-main">
          
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
                  {/* --- UPDATED: Calling new functions --- */}
                  <button className="btn-accept" onClick={() => handleAcceptSwap(swap._id)}>Accept</button>
                  <button className="btn-decline" onClick={() => handleDeclineSwap(swap._id)}>Decline</button>
                </div>
              </div>
            ))
          )}

        <h2 style={{ marginTop: '2rem' }}>Ongoing Exchanges</h2>
        {ongoingExchanges.length === 0 ? (
          <p>No ongoing exchanges.</p>
        ) : (
          ongoingExchanges.map(swap => (
            <div key={swap._id} className="swap-card">
              <div>
                Swap for <strong>{swap.skillRequested}</strong> with <strong>
                  {swap.provider._id === profile._id ? swap.requester.username : swap.provider.username}
                </strong>
                <p>In Progress</p>
                <div className="progress-bar"><div style={{ width: '50%' }}></div></div>
              </div>
              <div className="swap-card-footer">
                {/* --- This button was already correct --- */}
                <button 
                  className="btn-complete"
                  onClick={() => handleCompleteSwap(swap._id)}
                >
                  Mark as Completed
                </button>
              </div>
            </div>
          ))
        )}

          <h2 style={{ marginTop: '2rem' }}>Swap History</h2>
          {swapHistory.length === 0 ? (
            <p>No completed or declined swaps.</p>
          ) : (
            swapHistory.map(swap => (
              // --- UPDATED: Added a class for styling ---
              <div key={swap._id} className={`request-card history ${swap.status}`}>
                <p>
                  {/* --- UPDATED: Better formatting --- */}
                  <span className={`history-status ${swap.status}`}>
                    {swap.status.charAt(0).toUpperCase() + swap.status.slice(1)}
                  </span>
                  Swap with <strong>
                  {swap.provider._id === profile._id ? swap.requester.username : swap.provider.username}
                  </strong> for <span className="skill">{swap.skillRequested}</span>.
                </p>
              </div>
            ))
          )}
        </div>

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