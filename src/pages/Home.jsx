import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-page page-content">
      <div className="hero">
        <h1>Welcome to JiraniLink</h1>
        <p>
          Connect with your neighbors to borrow and share items. Build a
          stronger community together!
        </p>
        <Link to="/catalog" className="btn-primary">
          Browse Items
        </Link>
      </div>
      <div className="features-section">
        <h2 className="section-title">Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>🔧 Borrow Tools</h3>
            <p>Get the tools you need without buying them.</p>
          </div>
          <div className="feature-card">
            <h3>🏠 Share with Neighbors</h3>
            <p>Share your items and earn extra income.</p>
          </div>
          <div className="feature-card">
            <h3>🌟 Build Trust</h3>
            <p>Rate and review your neighbors for safe borrowing.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
