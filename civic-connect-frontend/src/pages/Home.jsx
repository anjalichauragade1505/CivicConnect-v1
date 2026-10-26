import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-root">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay" />

        {/* Background Emoji Icons */}
        <div className="floating-icons">
          <span className="icon people">🧑‍🤝‍🧑</span>
          <span className="icon heart">💛</span>
          <span className="icon pin">📍</span>
          <span className="icon building">🏛️</span>
        </div>

        <div className="hero-content">
          <div className="badge">⚡ Empowering Communities Since 2025</div>
          <br></br>
          <h1 className="main-title">
            <span className="gradient-text">Your Voice,</span><br />
            <span className="gradient-text-alt">Our Action</span>
          </h1>

          <p className="hero-subtext">
            Join <strong>thousands of citizens</strong> making a real difference in their communities.
            Report issues, track progress, and witness positive change happen together.
          </p>

          <div className="hero-buttons">
            <Link to="/login" className="btn-primary">🚀 Start Your Journey</Link>
            <Link to="/register" className="btn-outline">🙌 Join the Movement</Link>
          </div>
            <br></br>
            <br></br>
          <div className="trust-indicators">
           <b> <span>✅ Trusted by 5,000+ citizens</span></b>
          <b>  <span>⭐ 4.9/5 satisfaction rating</span></b>
           <b> <span>⏱️ 48hr average response</span></b>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-box">
            <h2>5,240+</h2>
            <p>Active Citizens</p>
          </div>
          <div className="stat-box">
            <h2>3,890+</h2>
            <p>Issues Resolved</p>
          </div>
          <div className="stat-box">
            <h2>48hrs</h2>
            <p>Avg Response Time</p>
          </div>
          <div className="stat-box">
            <h2>97%</h2>
            <p>Satisfaction Rate</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="how-header">
          <h2>How We Make Change Happen</h2>
          <p>Three simple steps to transform your concerns into real solutions</p>
        </div>
        <div className="how-cards">
          <div className="how-card">
            <div className="icon-circle blue">📍</div>
            <h3>Report & Document</h3>
            <p>Snap a photo, drop a pin, and describe the issue clearly to get it noticed by the authorities.</p>
          </div>
          <div className="how-card">
            <div className="icon-circle teal">⏱️</div>
            <h3>Track Progress</h3>
            <p>Follow your report’s journey and get real-time status updates from submission to resolution.</p>
          </div>
          <div className="how-card">
            <div className="icon-circle green">✅</div>
            <h3>Celebrate Results</h3>
            <p>Watch your neighborhood improve and celebrate resolved issues that make life better for all.</p>
          </div>
                {/* Footer Section */}
      <footer className="footer">
        <div className="footer-links">
          <Link to="/about">About</Link>
          <a href="mailto:civicconnect.team@gmail.com?subject=Contact%20CivicConnect&body=Hello%2C%20I%20would%20like%20to%20get%20in%20touch%20regarding...">Contact: civicconnect.team@gmail.com</a>
          <a href="#support">Support</a>
        </div>
        <p className="footer-credit">© 2025 CivicConnect. Built with ❤️ by Anjali Chauragade.</p>
      </footer>

        </div>
      </section>
    </div>
  );
}

