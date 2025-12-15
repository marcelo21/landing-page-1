import React from 'react';

const CtaSection = () => {
  return (
    <section id="contacto" className="cta-section">
      <div className="container">
        <h2>¿Listo para optimizar su producción?</h2>
        <p style={{ marginBottom: '30px' }}>
          Hablemos sobre cómo podemos mejorar sus procesos de soldadura y automatización hoy mismo.
        </p>
        <button className="btn" style={{ backgroundColor: 'white', color: '#333' }} onClick={() => window.location = 'mailto:correo@correo.com'}>
          Contactar Ahora
        </button>
      </div>
    </section>
  );
};

export default CtaSection;
