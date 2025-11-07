import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/" style={{ color: "white", textDecoration: "none" }}>
          JiraniLink
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/" className="nav-link">
          Home
        </Link>
        <Link to="/catalog" className="nav-link">
          Catalog
        </Link>
        <Link to="/my-items" className="nav-link">
          My Items
        </Link>
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
        <span>Welcome, Neighbor!</span>
      </div>
    </nav>
  );
};

export default Navbar;