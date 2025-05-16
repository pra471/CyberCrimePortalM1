import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">🛡️ Cybercrime Portal</Link>
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        ☰
      </div>

      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li><Link to="/" onClick={() => setIsOpen(false)}>Report</Link></li>
        <li><Link to="/status" onClick={() => setIsOpen(false)}>Check Status</Link></li>
        <li><Link to="/admin-login" onClick={() => setIsOpen(false)}>Admin Login</Link></li>
      </ul>
    </nav>
  );
}
