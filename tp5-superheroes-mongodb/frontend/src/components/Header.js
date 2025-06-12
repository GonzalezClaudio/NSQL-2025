import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Header.css'; // Asegurate de crear este archivo

const Header = () => {
  return (
    <header className="header-container">
      <div className="header-logos">
        <img src="/logo/logo-marvel.png" alt="Marvel" className="logo" />
        <h1 className="title">Superhéroes</h1>
        <img src="/logo/logo-dc.png" alt="DC" className="logo" />
      </div>
      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/marvel">Marvel</Link>
        <Link to="/dc">DC</Link>
        <Link to="/agregar">Add</Link>
      </nav>
    </header>
  );
};

export default Header;
