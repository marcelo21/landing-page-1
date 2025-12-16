/**
 * Footer
 * @description Pie de página con información de contacto y copyright
 * @returns {JSX.Element} Sección footer con datos de la empresa
 */
import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <h3>FEMAS Tecnología Industrial</h3>
        <p>Córdoba, Argentina</p>
        <p>Email: fe.mas.ingenieria@gmail.com</p>
        <br />
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} FEMAS. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
