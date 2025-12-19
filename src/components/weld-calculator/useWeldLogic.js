import { useState, useEffect, useMemo } from 'react';

const MATERIALS = {
  "1": { name: "Acero Negro", Ki: 1.00, Kt: 1.00, Kf: 1.00, color: "#333333" },
  "2": { name: "Galvanizado", Ki: 1.10, Kt: 1.05, Kf: 1.05, color: "#A0A0A0" },
  "3": { name: "Aluminizado", Ki: 1.25, Kt: 1.10, Kf: 1.00, color: "#E0E0E0" },
  "4": { name: "HSLA/DP",     Ki: 0.95, Kt: 0.95, Kf: 1.10, color: "#8B4513" },
  "5": { name: "Inoxidable",  Ki: 0.90, Kt: 0.85, Kf: 1.10, color: "#C0C0C0" },
};

const PROJECTION_DATA = {
  "M4":  { T: 4,  I_m: 11.5, I_b: 0.5,  F_m: 3.0, F_b: 0.5 },
  "M5":  { T: 4,  I_m: 11.5, I_b: 0.5,  F_m: 3.0, F_b: 0.5 },
  "M6":  { T: 6,  I_m: 17.0, I_b: 0.0,  F_m: 3.3, F_b: 0.8 },
  "M7":  { T: 6,  I_m: 17.0, I_b: 0.0,  F_m: 3.3, F_b: 0.8 },
  "M8":  { T: 8,  I_m: 6.0,  I_b: 10.0, F_m: 2.5, F_b: 3.5 },
  "M10": { T: 9,  I_m: 5.0,  I_b: 13.0, F_m: 2.5, F_b: 4.5 },
  "M12": { T: 11, I_m: 5.0,  I_b: 13.0, F_m: 2.5, F_b: 4.5 },
};

/**
 * useWeldLogic
 * @description Hook personalizado que maneja la lógica de negocio de la calculadora
 * Gestiona el estado de materiales, espesores y realiza los cálculos de parámetros
 * @returns {Object} Estado y funciones de control de la calculadora
 */
export const useWeldLogic = () => {
  const [mode, setMode] = useState('spot'); // 'spot' | 'projection'
  const [materialKey, setMaterialKey] = useState("1");
  
  // Spot Welding State
  const [thicknesses, setThicknesses] = useState([1.5, 1.5, 0]); // [chapa1, chapa2, chapa3]

  // Projection Welding State
  const [projectionConfig, setProjectionConfig] = useState({
    rosca: "M6",
    tipo: "Tuerca", // Tuerca | Tornillo
    geo_proy: "Esférica", // Esférica | Anular
    t_chapa: 1.5,
    n_proy: 3
  });

  const results = useMemo(() => {
    const matFactors = MATERIALS[materialKey];
    let T_final = 0, I_final = 0, F_final = 0;
    let extraInfo = {};

    if (mode === 'spot') {
      const activeThicknesses = thicknesses.filter(t => t > 0);
      const t_ref = activeThicknesses.length > 0 
        ? activeThicknesses.reduce((a, b) => a + b, 0) / activeThicknesses.length 
        : 0;
      const t_min = activeThicknesses.length > 0 ? Math.min(...activeThicknesses) : 0;
      const t_max = activeThicknesses.length > 0 ? Math.max(...activeThicknesses) : 0;

      let T_base, I_base, F_base;

      if (t_ref <= 2.0) {
        T_base = 10 * t_ref + 5;
        I_base = 1.13 * t_ref + 7.1;
        F_base = 1.64 * t_ref + 0.45;
      } else {
        T_base = 20 * t_ref - 12.5;
        I_base = 1.50 * t_ref + 5.8;
        F_base = 1.30 * t_ref + 0.70;
      }

      T_final = T_base * matFactors.Kt;
      I_final = I_base * matFactors.Ki;
      F_final = F_base * matFactors.Kf;

      let nugget1Min = 0;
      let nugget2Min = 0;

      if (thicknesses[0] > 0 && thicknesses[1] > 0) {
        nugget1Min = 5 * Math.sqrt(Math.min(thicknesses[0], thicknesses[1]));
      }

      if (thicknesses[1] > 0 && thicknesses[2] > 0) {
        nugget2Min = 5 * Math.sqrt(Math.min(thicknesses[1], thicknesses[2]));
      }

      extraInfo = {
        nuggetMin: nugget1Min,
        nugget1Min,
        nugget2Min,
        electrode: 2 * t_max + 3,
        t_ref
      };

    } else if (mode === 'projection') {
      const data = PROJECTION_DATA[projectionConfig.rosca];
      let T_base = data.T;
      let I_base = (data.I_m * projectionConfig.t_chapa) + data.I_b;
      let F_base = (data.F_m * projectionConfig.t_chapa) + data.F_b;

      // Corrections
      if (projectionConfig.tipo === "Tuerca") {
        I_base *= 0.85;
      }

      if (projectionConfig.geo_proy === "Anular") {
        I_base *= 1.20;
        F_base *= 1.10;
      }

      if (projectionConfig.n_proy >= 4) {
        I_base *= 1.10;
        F_base *= 1.10;
      }

      T_final = T_base * matFactors.Kt;
      I_final = I_base * matFactors.Ki;
      F_final = F_base * matFactors.Kf;
    }

    return {
      time: T_final,
      current: I_final,
      force: F_final,
      ...extraInfo,
      materialName: matFactors.name,
      materialColor: matFactors.color
    };

  }, [mode, materialKey, thicknesses, projectionConfig]);

  return {
    mode, setMode,
    materialKey, setMaterialKey,
    thicknesses, setThicknesses,
    projectionConfig, setProjectionConfig,
    results,
    MATERIALS,
    PROJECTION_DATA
  };
};
