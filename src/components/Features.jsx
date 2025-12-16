/**
 * Features
 * @description Sección de características diferenciadoras con imágenes
 * Muestra dos características principales alternadas con contenido e imágenes
 * @returns {JSX.Element} Sección con características de FEMAS
 */
import React from 'react';

const Features = () => {
  return (
    <section id="nosotros" className="features">
      <div className="container">
        <h2>¿Por qué elegir FEMAS?</h2>
        
        <div className="feature-item">
          <div className="feature-text">
            <h3>Experiencia Automotriz</h3>
            <p>
              Entendemos los rigurosos estándares de la industria automotriz. 
              Nuestros procesos están diseñados para cumplir con las normativas 
              de calidad más exigentes del mercado.
            </p>
          </div>
          {/* Placeholder visual simple */}
          <div className="feature-image" style={{ overflow: 'hidden' }}>
            <img src="/card_1.jpg" alt="Experiencia Automotriz" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>

        <div className="feature-item" style={{ flexDirection: 'row-reverse' }}>
          <div className="feature-text">
            <h3>Soluciones Integrales</h3>
            <p>
              Desde el hardware físico hasta el software de gestión. Ofrecemos 
              un ecosistema completo para que no tenga que lidiar con múltiples 
              proveedores incompatibles.
            </p>
          </div>
          <div className="feature-image" style={{ overflow: 'hidden' }}>
            <img src="/card_2.jpg" alt="Soluciones Integrales" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
