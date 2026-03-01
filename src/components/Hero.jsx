/**
 * Hero
 * @description Sección principal (hero) con mensaje de bienvenida y CTA
 * @returns {JSX.Element} Sección hero con título, descripción y botón
 */
import React from 'react';
import styles from './Hero.module.css';

const Hero = () => {
  return (
    <section className={styles.hero}>
      <div className="container">
        <h1>Ingeniería y Precisión Industrial</h1>
        <p>
          Líderes en Soldadura por Puntos, Automatización y Desarrollo de Hardware
          para la industria automotriz en Córdoba y Argentina.
        </p>
        <a href="#contacto" className="btn btn-primary">
          Solicitar Cotización
        </a>
      </div>
    </section>
  );
};

export default Hero;
