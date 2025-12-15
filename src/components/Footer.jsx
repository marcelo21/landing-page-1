import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <h3>FEMAS Tecnología Industrial</h3>
        <p>Córdoba, Argentina</p>
        <p>Email: correo@correo.com</p>
        <br />
        <p style={{ fontSize: '0.9rem', opacity: 0.7 }}>
          &copy; {new Date().getFullYear()} FEMAS. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
