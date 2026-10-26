import React from "react";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="overlay">
          <h1 className="about-title">About CivicConnect</h1>
          <p className="about-subtitle">
            Small Actions, Big Impact — Join the Civic Movement
          </p>
        </div>
      </div>

      <div className="about-content">
        <section>
          <h2>Our Mission</h2>
          <p>
            CivicConnect empowers citizens to report local civic issues such as potholes,
            broken streetlights, garbage dumps, and more. We bridge the gap between the
            public and municipal authorities by providing a fast, transparent, and
            efficient grievance redressal platform.
          </p>
        </section>

        <section>
          <h2>Why CivicConnect?</h2>
          <ul>
            <li>✅ Trusted by 5,000+ citizens</li>
            <li>⏱️ 48hr average response time</li>
            <li>📍 Location-based reporting</li>
            <li>📸 Image-supported complaints</li>
            <li>📊 Transparent status tracking</li>
          </ul>
        </section>

        <section>
          <h2>Our Vision</h2>
          <p>
            To create smart, clean, and responsive cities by enabling every citizen to
            actively participate in civic improvement. Your voice matters — and with
            CivicConnect, it reaches the right ears.
          </p>
        </section>

        <section>
          <h2>Meet the Team</h2>
          <p>
            We’re a team of students and developers passionate about creating impactful
            digital solutions. From developers to designers, CivicConnect is built with
            care, code, and a commitment to change.
          </p>
        </section>
        <section className="developer-highlight">
  <h2>Know the Developer</h2>
  <p>
    Hi! I'm <span className="shimmer-name large-name">Anjali Chauragade</span>, a passionate developer.
    I created CivicConnect as a step toward improving civic engagement using technology.
    I believe that even small actions can make a big impact.
  </p>
  <p>
     This project is built using the <strong>MERN stack</strong> (MongoDB, Express.js, React, Node.js).
    I designed and developed both the <strong>frontend</strong> and <strong>backend</strong> of this platform to
    empower citizens and create meaningful civic change.
  </p>
  <p>
    🔗 Visit my GitHub:{" "}
    <a href="https://github.com/anjalichauragade1505" target="_blank" rel="noopener noreferrer">
      github.com/anjalichauragade1505
    </a>
  </p>
</section>

        <section className="developer-info">
  <p>
    👩‍💻 Developed by{" "}
    <span className="shimmer-name large-name">Anjali Chauragade</span>
  </p>
  <p>
    📧 Contact us at:{" "}
    <a href="mailto:support@civicconnect.com" className="email-link">
      support@civicconnect.com
    </a>
  </p>
</section>

      </div>
    </div>
  );
};

export default About;
