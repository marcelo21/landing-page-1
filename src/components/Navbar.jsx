import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import styles from './Navbar.module.css';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className={styles.navbar}>
      <div className={`container ${styles.navContent}`}>
        <div className={styles.logoRow}>
          <div className={styles.logo}>FEMAS TI</div>
          <div className={styles.mobileActions}>
            <ThemeToggle />
            <button 
              className={styles.menuToggle} 
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ''}`}>
          <a href="#servicios" onClick={closeMenu}>Servicios</a>
          <a href="#nosotros" onClick={closeMenu}>Nosotros</a>
          <a href="#contacto" onClick={closeMenu}>Contacto</a>
          <div className={styles.desktopThemeToggle}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
