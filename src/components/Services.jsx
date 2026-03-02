/**
 * Services
 * @description Grid de servicios principales de FEMAS Tecnología Industrial
 * Renderiza tarjetas con iconos y descripciones de cada servicio
 * @returns {JSX.Element} Sección con grid de servicios
 */
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import WeldCalculator from './weld-calculator/WeldCalculator';
import RogowskiCalculator from './rogowski-calculator/RogowskiCalculator';
import HMIMicroSimulator from './hmi-simulator/HMIMicroSimulator';
import SpotStrengthCalculator from './spot-strength-calculator/SpotStrengthCalculator';
import LoginModal from './LoginModal';
import SpotWeldDetails from './SpotWeldDetails';
import styles from './Services.module.css';

const Services = () => {
  const [showCalculator, setShowCalculator] = useState(false);
  const [showRogowski, setShowRogowski] = useState(false);
  const [showHmi, setShowHmi] = useState(false);
  const [showSpotWeld, setShowSpotWeld] = useState(false);
  const [showSpotStrength, setShowSpotStrength] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  const handleWeldMasterClick = () => {
    if (isAuthenticated) {
      setShowCalculator(true);
    } else {
      setPendingAction('weld');
      setShowLogin(true);
    }
  };

  const handleRogowskiClick = () => {
    if (isAuthenticated) {
      setShowRogowski(true);
    } else {
      setPendingAction('rogowski');
      setShowLogin(true);
    }
  };

  const handleHmiClick = () => {
    setShowHmi(true);
  };

  const handleSpotWeldClick = () => {
    setShowSpotWeld(true);
  };

  const handleSpotStrengthClick = () => {
    setShowSpotStrength(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setShowLogin(false);

    if (pendingAction === 'rogowski') {
      setShowRogowski(true);
    } else if (pendingAction === 'weld') {
      setShowCalculator(true);
    }
    setPendingAction(null);
  };

  // Determinar datos para el login modal
  const loginAppData = pendingAction === 'rogowski'
    ? { name: 'Rogowski Calculator', icon: '⚙️' }
    : { name: 'WeldMaster PRO', icon: '🧮' };

  /**
   * Array de servicios
   * @type {Array<{icon: string, title: string, desc: string, action?: () => void}>}
   */
  const servicesList = [
    {
      icon: "⚡",
      title: "Soldadura por Puntos",
      desc: "Especialistas en sistemas de soldadura para la industria automotriz, garantizando uniones perfectas.",
      action: handleSpotWeldClick
    },
    {
      icon: "🧮",
      title: "WeldMaster PRO",
      desc: "Calculadora avanzada de parámetros de soldadura. Simulación de stackup y cálculo de corriente/fuerza.",
      action: handleWeldMasterClick
    },
    {
      icon: "🤖",
      title: "Automatización",
      desc: "Diseño e implementación de automatismos y HMIs personalizados para optimizar y visualizar sus líneas de producción.",
      action: handleHmiClick
    },
    {
      icon: "💻",
      title: "Software Industrial",
      desc: "Desarrollo de software de gestión a medida para el control y trazabilidad de procesos."
    },
    {
      icon: "🔬",
      title: "Ensayos y Validación",
      desc: "Ensayos destructivos y no destructivos (NDT) para asegurar la calidad y validación de procesos.",
      action: handleSpotStrengthClick
    },
    {
      icon: "⚙️",
      title: "Hardware Especializado",
      desc: "Fabricación de hardware electrónico y mecánico y diseño de bobinas Rogowski.",
      action: handleRogowskiClick
    }
  ];

  return (
    <section id="servicios" className={styles.services}>
      <div className="container">
        <h2>Nuestras Soluciones</h2>
        <p className="section-desc">
          Tecnología de punta aplicada a resolver los desafíos más complejos de la industria manufacturera.
        </p>

        <div className={styles.gridContainer}>
          {servicesList.map((service, index) => (
            <div
              key={index}
              className={`${styles.card} ${service.action ? styles.interactiveCard : ''}`}
              onClick={service.action}
            >
              <span className={styles.cardIcon}>{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.desc}</p>

              {service.action && (
                <div className={styles.cardCta}>
                  <span>Ver detalles</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {showLogin && (
        <LoginModal
          onLogin={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
          appName={loginAppData.name}
          appIcon={loginAppData.icon}
        />
      )}

      {showCalculator && (
        <WeldCalculator onClose={() => setShowCalculator(false)} />
      )}

      {showRogowski && (
        <RogowskiCalculator onClose={() => setShowRogowski(false)} />
      )}

      {showSpotWeld && (
        <SpotWeldDetails onClose={() => setShowSpotWeld(false)} />
      )}

      {showSpotStrength && (
        <SpotStrengthCalculator onClose={() => setShowSpotStrength(false)} />
      )}

      {showHmi && (
        <HMIMicroSimulator onClose={() => setShowHmi(false)} />
      )}
    </section>
  );
};

export default Services;
