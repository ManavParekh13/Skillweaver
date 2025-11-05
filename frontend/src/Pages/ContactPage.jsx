import React from 'react';
import './Form.css'; 

function ContactPage() {

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <div className="form-header">
          <h1>Contact Us</h1>
          <p>Have a question or feedback? Let us know!</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Your Name</label>
            <input type="text" id="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Your Email</label>
            <input type="email" id="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <input type="text" id="subject" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              rows="5" 
              required
              style={{ width: '100%', padding: '0.75rem 1rem', border: '1px solid #D1D5DB', borderRadius: '6px', fontFamily: 'inherit', resize: 'vertical' }}
            ></textarea>
          </div>

          <button type="submit" className="form-button">Send Message</button>
        </form>
      </div>
    </div>
  );
}

export default ContactPage;