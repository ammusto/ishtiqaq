import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {

  return (
    <header>
      <div className="header-container">
        <div className="header-text"><a href="http://ishtiqaq.pages.dev" className='main-link'>Ishtiqāq</a></div>
        <nav className="navbar">
          <ul className="nav-links flex m0">
            <li><Link to="/">Search</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/howto">How To Use</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;