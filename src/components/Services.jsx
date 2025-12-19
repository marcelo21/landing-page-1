/**
 * Services
 * @description Grid de servicios principales de FEMAS Tecnología Industrial
 * Renderiza tarjetas con iconos y descripciones de cada servicio
 * @returns {JSX.Element} Sección con grid de servicios
 */
import React, { useState } from 'react';
import WeldCalculator from './weld-calculator/WeldCalculator';

const Services = () => {
  const [showCalculator, setShowCalculator] = useState(false);

  /**
   * Array de servicios
   * @type {Array<{icon: string, title: string, desc: string, action?: () => void}>}
   */
  const servicesList = [
    {
      icon: "⚡",
      title: "Soldadura por Puntos",
      desc: "Especialistas en sistemas de soldadura para la industria automotriz, garantizando uniones perfectas."
    },
    {
      icon: "🧮",
      title: "WeldMaster PRO",
      desc: "Calculadora avanzada de parámetros de soldadura. Simulación de stackup y cálculo de corriente/fuerza.",
      action: () => setShowCalculator(true)
    },
    {
      icon: "🤖",
      title: "Automatización",
      desc: "Diseño e implementación de automatismos pequeños y medianos para optimizar sus líneas de producción."
    },
    {
      icon: "💻",
      title: "Software Industrial",
      desc: "Desarrollo de software de gestión a medida para el control y trazabilidad de procesos."
    },
    {
      icon: "🔬",
      title: "Ensayos y Validación",
      desc: "Ensayos destructivos y no destructivos (NDT) para asegurar la calidad y validación de procesos."
    },
    {
      icon: "⚙️",
      title: "Hardware Especializado",
      desc: "Fabricación de hardware electrónico y mecánico específico para necesidades industriales únicas."
    }
  ];

  return (
    <section id="servicios" className="services">
      <div className="container">
        <h2>Nuestras Soluciones</h2>
        <p className="section-desc">
          Tecnología de punta aplicada a resolver los desafíos más complejos de la industria manufacturera.
        </p>
        
        <div className="grid-container">
          {servicesList.map((service, index) => (
            <div 
              key={index} 
              className={`card ${service.action ? 'interactive-card' : ''}`}
              onClick={service.action}
              style={service.action ? { cursor: 'pointer', border: '1px solid #7aa2f7' } : {}}
            >
              <span className="card-icon">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
      {showCalculator && (
        <WeldCalculator onClose={() => setShowCalculator(false)} />
      )}
    </section>
  );
};

export default Services;
