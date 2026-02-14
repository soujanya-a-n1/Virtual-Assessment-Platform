import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About</h3>
          <p>Virtual Assessment Platform - A comprehensive solution for online examinations and assessments.</p>
        </div>

        <div className="footer-section">
          <h3>Features</h3>
          <ul>
            <li>Online Exams</li>
            <li>Auto-Save & Submit</li>
            <li>Proctoring</li>
            <li>Analytics</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Support</h3>
          <ul>
            <li>Help Center</li>
            <li>Contact Us</li>
            <li>Documentation</li>
            <li>FAQ</li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Legal</h3>
          <ul>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
            <li>Cookie Policy</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2024 Virtual Assessment Platform. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
