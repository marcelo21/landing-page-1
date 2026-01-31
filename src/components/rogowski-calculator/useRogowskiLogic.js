import { useState, useMemo, useEffect } from 'react';

/**
 * useRogowskiLogic
 * @description Hook que replica la lógica de BobinaRogowski (Python)
 * Gestiona inputs de geometría, parámetros eléctricos y cálculos físicos.
 */
export const useRogowskiLogic = () => {
  // Modo de entrada: 'diametro' (D) o 'longitud' (L_tira)
  const [inputMode, setInputMode] = useState('diametro'); 

  const [inputs, setInputs] = useState({
    v_out_target_mv: 142.0,
    i_rated: 1000,
    freq: 60,
    // Geometría del Transformador
    d_bobina_mm: 181.43,    // Diametro toroide
    longitud_tira_mm: 570.0,  // O largo de la tira
    // Geometría del Núcleo
    altura_nucleo_mm: 20.0,
    espesor_nucleo_mm: 6.0,
    diametro_hilo_mm: 0.203 // AWG 32
  });
  
  // Efecto para sincronizar diameter y length al cambiar de modo
  useEffect(() => {
     if (inputMode === 'diametro') {
         // Si cambiamos a diametro, recalculamos la longitud basada en dia anterior
         // (Opcional, pero aqui mantendremos los valores individuales)
     }
  }, [inputMode]);

  const results = useMemo(() => {
    // Constantes Físicas
    const MU_0 = 4 * Math.PI * 1e-7;
    const OMEGA = 2 * Math.PI * inputs.freq;
    const RHO_CU = 1.72e-8;

    // Conversión de unidades a SI (metros, voltios, amperios)
    const v_out = inputs.v_out_target_mv / 1000.0;
    const h_nucleo = inputs.altura_nucleo_mm / 1000.0;
    const w_nucleo = inputs.espesor_nucleo_mm / 1000.0;
    const diametro_hilo = inputs.diametro_hilo_mm / 1000.0;

    // Determinar Diametro de Bobina (D_bobina)
    let d_bobina = 0;
    if (inputMode === 'diametro') {
        d_bobina = inputs.d_bobina_mm / 1000.0;
    } else {
        d_bobina = (inputs.longitud_tira_mm / Math.PI) / 1000.0;
    }

    // Validaciones basicas
    if (d_bobina <= 0 || h_nucleo <= 0 || w_nucleo <= 0 || inputs.i_rated <= 0 || inputs.freq <= 0) {
        return {
            vueltas: 0,
            inductancia_mutua_nH: 0,
            factor_llenado: 0,
            resistencia_ohm: 0,
            longitud_hilo_m: 0,
            es_viable: false,
            paso_mm: 0,
            gap_mm: 0,
            d_int_mm: 0,
            d_ext_mm: 0,
            error: "Parámetros inválidos"
        };
    }

    // 1. Geometría
    const r_medio = d_bobina / 2;
    const r_int = r_medio - (w_nucleo / 2);
    const r_ext = r_medio + (w_nucleo / 2);

    if (w_nucleo >= d_bobina) {
         return { error: "El espesor del núcleo es demasiado grande para el diámetro.", es_viable: false };
    }

    // 2. Vueltas (Teóricas)
    // m_necesaria = V / (w * I)
    const m_necesaria = v_out / (OMEGA * inputs.i_rated);
    const term_ln = Math.log(r_ext / r_int);
    
    // N = (2 * pi * M) / (mu0 * h * ln(re/ri))
    let n_vueltas = (2 * Math.PI * m_necesaria) / (MU_0 * h_nucleo * term_ln);
    n_vueltas = Math.round(n_vueltas);

    // 3. Viabilidad
    const perimetro_interno_toroide = 2 * Math.PI * r_int;
    const longitud_ocupada_cobre = n_vueltas * diametro_hilo;

    let factor_llenado = 0;
    if (perimetro_interno_toroide > 0) {
        factor_llenado = (longitud_ocupada_cobre / perimetro_interno_toroide) * 100;
    }

    const es_viable = longitud_ocupada_cobre <= perimetro_interno_toroide;

    // --- CÁLCULOS MECÁNICOS ---
    const longitud_tira_nucleo = Math.PI * d_bobina;
    const FACTOR_DOBLADO_MANUAL = 1.05;
    const perimetro_seccion_nucleo = 2 * (h_nucleo + w_nucleo);

    const longitud_bobinado = n_vueltas * perimetro_seccion_nucleo * FACTOR_DOBLADO_MANUAL;
    const longitud_retorno = longitud_tira_nucleo;
    
    const longitud_total_hilo = longitud_bobinado + longitud_retorno;

    // Resistencia
    const area_seccion_hilo = Math.PI * Math.pow((diametro_hilo / 2), 2);
    let resistencia = 0;
    if (area_seccion_hilo > 0) {
        resistencia = (RHO_CU * longitud_total_hilo) / area_seccion_hilo;
    }

    // 4. Paso y Gap
    const perimetro_interno_real = 2 * Math.PI * r_int;
    let paso_mm = 0;
    let gap_mm = 0;
    
    if (n_vueltas > 0) {
        paso_mm = (perimetro_interno_real * 1000) / n_vueltas;
        gap_mm = paso_mm - (diametro_hilo * 1000);
    }
    
    return {
      vueltas: n_vueltas,
      inductancia_mutua_nH: m_necesaria * 1e9,
      d_int_mm: r_int * 2 * 1000,
      d_ext_mm: r_ext * 2 * 1000,
      factor_llenado: factor_llenado,
      es_viable: es_viable,
      longitud_hilo_m: longitud_total_hilo,
      resistencia_ohm: resistencia,
      longitud_circunferencia_mm: longitud_tira_nucleo * 1000,
      paso_sugerido_mm: paso_mm,
      gap_sugerido_mm: gap_mm,
      error: null
    };
  }, [inputs, inputMode]);

  return {
    inputMode, 
    setInputMode,
    inputs, 
    setInputs,
    results
  };
};
