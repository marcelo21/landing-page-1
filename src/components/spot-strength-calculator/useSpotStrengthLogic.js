import { useState, useMemo } from 'react';

/**
 * Materiales predefinidos con sus UTS típicos (MPa)
 * @type {Object.<string, {name: string, uts: number, color: string}>}
 */
const MATERIALS = {
    "1": { name: "Acero Bajo Carbono", uts: 350, color: "#555555" },
    "2": { name: "Galvanizado", uts: 380, color: "#A0A0A0" },
    "3": { name: "HSLA / DP 600", uts: 600, color: "#6B4226" },
    "4": { name: "TRIP 780", uts: 780, color: "#8B2500" },
    "5": { name: "Aluminio 5xxx", uts: 260, color: "#C8C8C8" },
    "6": { name: "Aluminio 6xxx", uts: 310, color: "#D8D8D8" },
    "7": { name: "Personalizado", uts: 400, color: "#777777" },
};

/**
 * useSpotStrengthLogic
 * @description Hook personalizado que implementa el modelo matemático de
 * estimación de fuerza de rotura estática en soldadura por puntos.
 * Basado en: docs/Analisis_esfuerzo.md
 * @returns {Object} Estado, setters y resultados calculados
 */
export const useSpotStrengthLogic = () => {
    const [materialKey, setMaterialKey] = useState("1");
    const [customUts, setCustomUts] = useState(400);

    // Parámetros geométricos
    const [diameter, setDiameter] = useState(5.0);   // d [mm]
    const [thickness, setThickness] = useState(1.5);  // t [mm]
    const [numSheets, setNumSheets] = useState(2);     // N (2..3)

    // Factores correctivos η
    const [etaQuality, setEtaQuality] = useState(0.90);       // η_c  (0.7–1.0)
    const [etaAlignment, setEtaAlignment] = useState(0.95);    // η_a  (0.8–1.0)
    const [etaPeel, setEtaPeel] = useState(0.50);              // η_p  (0.2–0.5)
    const [etaProcess, setEtaProcess] = useState(0.90);        // η_proc (0.8–0.95)

    // Toggle para mostrar/ocultar factores correctivos
    const [showFactors, setShowFactors] = useState(false);

    const results = useMemo(() => {
        const mat = MATERIALS[materialKey];
        const sigma_uts = materialKey === "7" ? customUts : mat.uts; // [MPa]

        // ── Resistencia al corte (von Mises) ──
        const tau = sigma_uts / Math.sqrt(3); // [MPa]

        // ── Parámetros derivados ──
        const d = diameter;         // [mm]
        const t = thickness;        // [mm]
        const N = numSheets;
        const n = N - 1;            // planos de corte

        // ── Diámetro mínimo (AWS D8.1) ──
        const d_min = 4 * Math.sqrt(t); // [mm]
        const d_crit = 3.5 * Math.sqrt(t); // [mm] umbral de rechazo

        // ── Fuerza de Arrancamiento (Pull-Out) ──
        // F_PO = π·d·t·τ  [N]  (d y t en mm → ÷1e6 para m², pero τ en MPa = N/mm²)
        // Con d,t en mm y τ en N/mm²: F_PO = π·d·t·τ [N]
        const F_PO = Math.PI * d * t * tau; // [N]

        // ── Fuerza de Cizalladura (Shear) ──
        // F_ciz = (π·d²/4)·τ [N]
        const F_shear = (Math.PI * d * d / 4) * tau; // [N]

        // ── Fuerza base (eslabón más débil) ──
        const F_base = Math.min(F_PO, F_shear);

        // ── Modo de falla predicho ──
        let failureMode, failureSafe;
        if (F_shear < F_PO) {
            failureMode = "Falla Interfacial";
            failureSafe = false;
        } else {
            failureMode = "Arrancamiento de Botón";
            failureSafe = true;
        }

        // ── Múltiples planos ──
        const F_total = F_base * n;

        // ── Factores correctivos ──
        const eta_product = etaQuality * etaAlignment * etaPeel * etaProcess;
        const F_real = F_total * eta_product;

        // ── Criterios de aceptación / rechazo ──
        let status, statusMessage;
        if (d < d_crit) {
            status = 'rejected';
            statusMessage = `Diámetro insuficiente (d < 3.5√t = ${d_crit.toFixed(2)} mm). Alta probabilidad de falla interfacial prematura.`;
        } else if (d < d_min) {
            status = 'warning';
            statusMessage = `Diámetro bajo el mínimo recomendado (d < 4√t = ${d_min.toFixed(2)} mm). Riesgo moderado.`;
        } else if (!failureSafe) {
            status = 'warning';
            statusMessage = 'Se predice falla interfacial. Verificar diámetro de botón o considerar ajuste de proceso.';
        } else {
            status = 'accepted';
            statusMessage = 'Diseño aceptable. Falla por arrancamiento de botón (modo deseable).';
        }

        // ── Relación F_PO / F_shear para gauge visual ──
        const strengthRatio = F_shear > 0 ? F_PO / F_shear : 0;

        return {
            sigma_uts,
            tau: tau,
            d_min,
            d_crit,
            F_PO,
            F_shear,
            F_base,
            F_total,
            F_real,
            eta_product,
            failureMode,
            failureSafe,
            status,
            statusMessage,
            strengthRatio,
            n,
            materialName: mat.name,
            materialColor: mat.color,
        };
    }, [materialKey, customUts, diameter, thickness, numSheets,
        etaQuality, etaAlignment, etaPeel, etaProcess]);

    return {
        materialKey, setMaterialKey,
        customUts, setCustomUts,
        diameter, setDiameter,
        thickness, setThickness,
        numSheets, setNumSheets,
        etaQuality, setEtaQuality,
        etaAlignment, setEtaAlignment,
        etaPeel, setEtaPeel,
        etaProcess, setEtaProcess,
        showFactors, setShowFactors,
        results,
        MATERIALS,
    };
};
