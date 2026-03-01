import React from 'react';
import { X, Wrench, ShieldCheck, Award, Microscope, RefreshCw, Zap, PencilRuler, Target, Grip } from 'lucide-react';
import styles from './SpotWeldDetails.module.css';

/**
 * Componente SpotWeldDetails
 * Modal informativo para servicios de Soldadura por Puntos
 * @param {Object} props
 * @param {Function} props.onClose - Función para cerrar el modal
 */
const SpotWeldDetails = ({ onClose }) => {

  const benefits = [
    {
      icon: <PencilRuler size={24} />,
      title: "Ingeniería Llave en Mano",
      desc: "Diseño y ejecución de proyectos integrales (Turnkey) que se adaptan sin fricción a su línea productiva, reduciendo tiempos de implementación y riesgos técnicos."
    },
    {
      icon: <Target size={24} />,
      title: "Blindaje de Procesos (Poka-Yoke)",
      desc: "Sistemas inteligentes a prueba de error que eliminan fallos humanos y mecánicos en origen, garantizando una producción con Cero Defectos."
    },
    {
      icon: <Wrench size={24} />,
      title: "Fabricación de Controles de Precisión",
      desc: "Desarrollo propio de tecnología de control de soldadura robusta, optimizada para la máxima repetibilidad y dominio total del núcleo de fusión."
    },
    {
      icon: <ShieldCheck size={24} />,
      title: "Continuidad Operativa (Uptime)",
      desc: "Respuesta inmediata ante fallos críticos y gestión estratégica de repuestos para eliminar tiempos muertos no planificados."
    },
    {
      icon: <Award size={24} />,
      title: "Certificación y Parametrización",
      desc: "Ajuste experto y calibración con trazabilidad normativa para superar auditorías exigentes y asegurar soldaduras idénticas ciclo tras ciclo."
    },
    {
      icon: <Microscope size={24} />,
      title: "Laboratorio de Ensayos (DT/NDT)",
      desc: "Validación rigurosa de la integridad estructural mediante pruebas destructivas y no destructivas para certificar la seguridad de cada unión."
    },
    {
      icon: <RefreshCw size={24} />,
      title: "Retrofitting de Alto ROI y Monitoreo HMI",
      desc: "Revitalice su maquinaria actual con tecnología de última generación y además con la posibilidad de integrar pantallas HMI (ver simulador en sitio), extendiendo su vida útil por una fracción de la inversión."
    },
    {
      icon: <Grip size={24} />,
      title: "Sincronización de Carga (Interlock)",
      desc: "Gestión inteligente del disparo de máquinas para evitar picos de consumo eléctrico al inicio, estabilizando la red y reduciendo costos energéticos."
    },
    {
      icon: <Zap size={24} />,
      title: "Diagnóstico de Potencia",
      desc: "Análisis profundo de transformadores y calidad de energía para prevenir fallos catastróficos y optimizar el consumo eléctrico de su planta."
    }
  ];

  return (
    <div className={styles['spot-weld-overlay']} onClick={onClose}>
      <div className={styles['spot-weld-modal']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['spot-weld-header']}>
          <h2>Servicios Integrales de Soldadura</h2>
          <button className={styles['close-btn']} onClick={onClose} aria-label="Cerrar">
            <X size={24} />
          </button>
        </div>

        <div className={styles['spot-weld-content']}>
          <div className={styles['benefits-list']}>
            {benefits.map((item, index) => (
              <div key={index} className={styles['benefit-item']}>
                <div className={styles['benefit-icon']}>
                  {item.icon}
                </div>
                <div className={styles['benefit-text']}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpotWeldDetails;
