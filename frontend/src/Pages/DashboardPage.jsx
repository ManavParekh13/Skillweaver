import React, { useState, useEffect } from 'react';
import api from '../utils/api.js';
import axios from 'axios'; // You were missing this import
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import './Dashboard.css';

// --- Helper Data (from seeder) ---
const SKILL_LIST = [
  'React', 'JavaScript', 'Node.js', 'Python', 'Guitar', 'Piano', 
  'Cooking', 'Baking', 'Photography', 'Graphic Design', 'Spanish', 
  'French', 'Yoga', 'Public Speaking', 'Marketing', 'SEO', 
  'Project Management', 'Data Analysis'
];
const LOCATION_LIST = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata'];
const LEVEL_LIST = ['Beginner', 'Intermediate', 'Expert'];
const ITEMS_PER_PAGE = 20;

function DashboardPage() {
  const { token } = useAuth();
  const [offerings, setOfferings] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- State for Filters ---
  const [searchUser, setSearchUser] = useState('');
  const [searchSkill, setSearchSkill] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchLevel, setSearchLevel] = useState('');

  // --- State for Pagination ---
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [myRequests, setMyRequests] = useState([]);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        // We need two separate requests
        // 1. Public request for all users (uses plain axios)
        const usersPromise = axios.get('/api/public/users');
        
        // 2. Private request for *my* swaps (uses 'api' helper)
        const swapsPromise = token ? api.get('/swaps/me') : Promise.resolve({ data: [] });

        // Run them at the same time
        const [usersRes, swapsRes] = await Promise.all([usersPromise, swapsPromise]);

        // Process users into offerings (same as before)
        const allOfferings = [];
        usersRes.data.forEach(user => {
          user.skillsToTeach.forEach(skillObj => {
            allOfferings.push({
              _id: `${user._id}_${skillObj.skill}`,
              skill: skillObj.skill,
              level: skillObj.level,
              user: { 
                _id: user._id,
                username: user.username,
                bio: user.bio,
                skillsToLearn: user.skillsToLearn,
                location: user.location 
              }
            });
          });
        });
        setOfferings(allOfferings);
        
        // Save the user's personal swap requests
        setMyRequests(swapsRes.data);

      } catch (err) {
        // Handle failed public data fetch
        if (err.config && err.config.url.includes('/api/public/users')) {
          console.error('Failed to load public users', err);
        } else if (err.config && err.config.url.includes('/swaps/me')) {
          console.error('Failed to load user swaps', err);
        } else {
          console.error('An unexpected error occurred', err);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [token]);

  // --- Full Filtering Logic ---
  const filteredOfferings = offerings.filter(offering => {
    // 1. Filter by Skill
    if (searchSkill && offering.skill !== searchSkill) {
      return false;
    }
    // 2. Filter by Location
    if (searchLocation && offering.user.location !== searchLocation) {
      return false;
    }
    // 3. Filter by Level
    if (searchLevel && offering.level !== searchLevel) {
      return false;
    }
    // 4. Filter by User
    const userTerm = searchUser.toLowerCase();
    if (userTerm && !offering.user.username.toLowerCase().includes(userTerm)) {
      return false;
    }
    
    return true; 
  });

  // --- Pagination Logic ---
  const loadMore = () => {
    setVisibleCount(prevCount => prevCount + ITEMS_PER_PAGE);
  };
  const offeringsToShow = filteredOfferings.slice(0, visibleCount);

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Browse Available Skills</h1>
        <p>Discover amazing skills shared by our community members.</p>
      </div>

      {/* --- Functional Filter Bar --- */}
      <div className="filter-bar">
        {/* --- Skill Dropdown --- */}
        <select 
          className="filter-select"
          value={searchSkill}
          onChange={(e) => setSearchSkill(e.target.value)}
        >
          <option value="">All Skills</option>
          {SKILL_LIST.map(skill => (
            <option key={skill} value={skill}>{skill}</option>
          ))}
        </select>

        {/* --- Location Dropdown --- */}
        <select 
          className="filter-select"
          value={searchLocation}
          onChange={(e) => setSearchLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {LOCATION_LIST.map(loc => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>

        {/* --- Level Dropdown --- */}
        <select 
          className="filter-select"
          value={searchLevel}
          onChange={(e) => setSearchLevel(e.target.value)}
        >
          <option value="">All Levels</option>
          {LEVEL_LIST.map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
        
        {/* --- User Search Input --- */}
        <div className="filter-search">
          <input
            type="text"
            placeholder="Search by username..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
        </div>
      </div>

      {/* --- Skill Grid --- */}
      {loading ? (
        <div>Loading skills...</div>
      ) : (
        <div className="skill-grid">
          {offeringsToShow.length === 0 ? (
            <p>No skills found. Try a different search!</p>
          ) : (
            offeringsToShow.map(offering => (
              <SkillCard 
                key={offering._id} 
                offering={offering} 
                myRequests={myRequests} // <-- This prop is now used
              />
            ))
          )}
        </div>
      )}

      {/* --- "See More" / "Register" Buttons --- */}
      {!token && filteredOfferings.length > visibleCount && (
        <div className="see-more-container">
          <p>Want to see all {filteredOfferings.length} results?</p>
          <Link to="/register" className="see-more-btn">
            Register for free to see more
          </Link>
        </div>
      )}
      {token && filteredOfferings.length > visibleCount && (
        <div className="see-more-container">
          <button className="see-more-btn" onClick={loadMore}>
            See More ({filteredOfferings.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  );
}

// --- Skill Card Component (NOW UPDATED) ---
function SkillCard({ offering, myRequests }) {
  const { token } = useAuth();
  
  // 1. ADD LOCAL STATE TO TRACK A *NEWLY* SENT REQUEST
  const [isNewlyRequested, setIsNewlyRequested] = useState(false);

  // 2. CHECK IF A REQUEST *ALREADY EXISTS* FROM PAGE LOAD
  // We check if any swap in `myRequests` matches this specific offering
  const existingRequest = myRequests.find(swap => 
    swap.provider === offering.user._id && 
    swap.skillRequested === offering.skill
  );

  const handleRequestSwap = async () => {
    const skillOffered = prompt(`What skill will you offer ${offering.user.username} in return for ${offering.skill}?`);
    if (!skillOffered) return;
    try {
      await api.post('/swaps', {
        providerId: offering.user._id,
        skillRequested: offering.skill,
        skillOffered: skillOffered
      });
      alert('Swap request sent successfully!');
      
      // 3. SET LOCAL STATE TO TRUE TO UPDATE THE BUTTON
      setIsNewlyRequested(true);
      
      // We no longer navigate, so the user doesn't lose their filters
      // navigate('/dashboard'); 
    } catch (err) {
      console.error(err);
      alert('Failed to send swap request.');
    }
  };

  const levelClass = offering.level.toLowerCase();

  // 4. DETERMINE FINAL BUTTON STATE
  const hasBeenRequested = existingRequest || isNewlyRequested;
  const currentStatus = existingRequest ? existingRequest.status : 'pending';

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
          <small>{offering.user.location}</small>
        </div>
      </div>
      
      <div className="skill-card-looking">
        <span>Looking for:</span> {offering.user.skillsToLearn.join(', ') || 'Not specified'}
      </div>
      
      {/* --- 5. UPDATED BUTTON LOGIC --- */}
      <div className="skill-card-footer">
        {token ? (
          hasBeenRequested ? (
            <button className="skill-swap-btn" disabled>
              {/* Show the status, capitalize first letter */}
              Swap {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
            </button>
          ) : (
            <button className="skill-swap-btn" onClick={handleRequestSwap}>
              Request Swap
            </button>
          )
        ) : (
          <Link to="/login" className="skill-swap-btn">
            Login to Request Swap
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;