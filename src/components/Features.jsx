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
          <div className="feature-image">🚗</div>
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
          <div className="feature-image">🔄</div>
        </div>
      </div>
    </section>
  );
};

export default Features;
