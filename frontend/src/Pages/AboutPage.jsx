import React from 'react';
import './StaticPage.css'; 

function AboutPage() {
  return (
    <div className="static-container">
      <h1>About SkillWeaver</h1>
      
      <p>
        Welcome to SkillWeaver, a community built on the simple idea that everyone has something to teach and something to learn. We believe that knowledge and skills are a currency more valuable than money.
      </p>

      <h2>Our Mission</h2>
      <p>
        Our mission is to connect passionate individuals within a community to foster collaborative learning and skill sharing. We aim to break down the financial barriers to education by creating a platform where skills are the only currency.
      </p>

      <h2>How It Works</h2>
      <p>
        SkillWeaver is a non-monetary platform. Instead of paying for lessons, you offer a skill you have in exchange for a skill you want.
      </p>
      <ul>
        <li><strong>Browse:</strong> Look through hundreds of skills offered by members of your community.</li>
        <li><strong>Request:</strong> Find a skill you want to learn? Send a swap request to the provider.</li>
        <li><strong>Swap:</strong> Once your request is accepted, you arrange a time to share your skills.</li>
        <li><strong>Grow:</strong> Learn something new, meet a new person, and build your reputation on the platform.</li>
      </ul>
      
      <p style={{ marginTop: '1rem' }}>
        This MERN stack application was built as a mini-project to demonstrate a full-stack, real-world application, from database design to deployment.
      </p>
    </div>
  );
}

export default AboutPage;