// frontend/src/components/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // We will create this next

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-copyright">
          © 2025 SkillWeaver. All rights reserved.
        </div>
        <div className="footer-links">
          <Link to="/about">About</Link>
          <Link to="/skills">Skills</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;