import React from "react";

const Home = () => {
  return (
    <div className="home-page page-content">
      <div className="hero">
        <h1>Welcome to JiraniLink</h1>
        <p>
          Connect with your neighbors to borrow and share items. Build a
          stronger community together!
        </p>
        <button className="btn-primary">
          <a href="/catalog">
            Browse Items
          </a>
        </button>
      </div>
      <div className="features">
        <div className="feature">
          <h3>🔧 Borrow Tools</h3>
          <p>Get the tools you need without buying them.</p>
        </div>
        <div className="feature">
          <h3>🏠 Share with Neighbors</h3>
          <p>Share your items and earn extra income.</p>
        </div>
        <div className="feature">
          <h3>🌟 Build Trust</h3>
          <p>Rate and review your neighbors for safe borrowing.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
