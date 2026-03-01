/**
 * Navbar
 * @description Barra de navegación principal con enlaces y toggle de tema
 * @returns {JSX.Element} Elemento nav con logo y enlaces de navegación
 */
import React from 'react';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const Navbar = () => {
  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <div className={styles.logo}>FEMAS TI</div>
        <div className={styles.navLinks}>
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
