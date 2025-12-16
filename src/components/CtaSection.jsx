/**
 * CtaSection
 * @description Sección de llamada a la acción (CTA) para contacto directo
 * @returns {JSX.Element} Sección con botón de contacto por email
 */
import React from 'react';

const CtaSection = () => {
  return (
    <section id="contacto" className="cta-section">
      <div className="container">
        <h2>¿Listo para optimizar su producción?</h2>
        <p style={{ marginBottom: '30px' }}>
          Hablemos sobre cómo podemos mejorar sus procesos de soldadura y automatización hoy mismo.
        </p>
        <button className="btn btn-cta" onClick={() => window.location = 'mailto:fe.mas.ingenieria@gmail.com'}>
          Contactar Ahora
        </button>
      </div>
    </section>
  );
};

export default CtaSection;
