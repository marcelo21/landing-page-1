import React from 'react';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="container nav-content">
        <div className="logo">FEMAS TI</div>
        <div className="nav-links">
          <a href="#servicios">Servicios</a>
          <a href="#nosotros">Nosotros</a>
          <a href="#contacto">Contacto</a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
