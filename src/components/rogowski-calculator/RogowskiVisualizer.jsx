import React, { useMemo } from 'react';

/**
 * RogowskiVisualizer
 * @description Renderiza un SVG técnico (Blueprint style) o Realista del toroide.
 * @param {string} visualMode - 'blueprint' | 'realistic'
 */
const RogowskiVisualizer = ({ inputs = {}, results = {}, visualMode = 'blueprint' }) => {
  // Dimensiones base
  const width = 600;
  const height = 500;

  // Dividimos el canvas en dos zonas:
  // Parte Superior (0 - 320): Gráfico Bobina
  // Parte Inferior (320 - 500): Sección y Datos

  // Centro para la bobina
  const centerTopY = 160;
  const centerX = width / 2;

  // Coordenadas fijas para la parte inferior
  const bottomSectionY = 360;

  const isBlueprint = visualMode === 'blueprint';

  // --- PALETAS DE COLORES ---
  const THEME = {
    blueprint: {
      bg: "#151b2b",
      grid: "#1e2a45",
      stroke: "#00f0ff",
      dim: "#8099ff",
      fillAccent: "rgba(0, 240, 255, 0.05)",
      text: "#00f0ff",
      coilStroke: "#00f0ff",
      coilOpacity: 0.9,
      coreFill: "url(#hatch)",
      coreStrokeOpacity: 0.3,
      divider: "#1e2a45"
    },
    realistic: {
      bg: "linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%)", // Fondo degradado sutil
      grid: "transparent",
      stroke: "rgba(255,255,255,0.4)", // Lineas de cota sutiles
      dim: "#cbd5e1", // Texto de cota claro
      fillAccent: "rgba(255, 255, 255, 0.02)",
      text: "#fff",
      coilStroke: "url(#copperGradient)", // Cobre real
      coilOpacity: 1,
      coreFill: "url(#coreRealGradient)",
      coreStrokeOpacity: 0.8,
      divider: "rgba(255,255,255,0.1)"
    }
  };

  const colors = isBlueprint ? THEME.blueprint : THEME.realistic;

  const hasResults = results && !results.error && results.vueltas > 0;

  // Cálculos de geometría visual
  const { r_final, w_coil, w_section, h_section, d_real, numDispTurns, sectionType } = useMemo(() => {
    // Safety check para inputs
    if (!inputs || Object.keys(inputs).length === 0) {
      return { r_final: 100, w_coil: 10, w_section: 20, h_section: 40, d_real: 200, numDispTurns: 100 };
    }

    // Sanitizar inputs
    const d_val = Number(inputs.d_bobina_mm) || 0;
    const l_val = Number(inputs.longitud_tira_mm) || 0;
    const h_nucleo_val = Number(inputs.altura_nucleo_mm) || 20;
    const w_nucleo_val = Number(inputs.espesor_nucleo_mm) || 10;
    const a_seccion_val = Number(inputs.radio_seccion_mm) || 5;
    const currentSectionType = (results && results.sectionType) || 'rectangular';

    // Si no hay diametro definido, calcularlo desde la longitud o usar default
    const d_real_val = d_val || (l_val / Math.PI) || 100;

    // --- 1. ESCALA PARA LA BOBINA (VISTA SUPERIOR) ---
    const pxPerMmCoil = 260 / (d_real_val || 1);

    const r_vis = (d_real_val / 2) * pxPerMmCoil;
    const r_final_clamped = Math.min(Math.max(r_vis, 40), 130);

    const w_coil_vis = (currentSectionType === 'rectangular' ? w_nucleo_val : a_seccion_val * 2) * (pxPerMmCoil * 0.5);
    const w_coil_final = Math.min(Math.max(w_coil_vis, 4), 30);

    // --- 2. ESCALA PARA LA SECCIÓN A-A (VISTA INFERIOR) ---
    let w_section_final, h_section_final;
    if (currentSectionType === 'rectangular') {
      const maxSectionDim = Math.max(h_nucleo_val, w_nucleo_val);
      const pxPerMmSection = Math.min(Math.max(80 / (maxSectionDim || 1), 1.5), 8);
      w_section_final = w_nucleo_val * pxPerMmSection;
      h_section_final = h_nucleo_val * pxPerMmSection;
    } else {
      const pxPerMmSection = Math.min(Math.max(40 / (a_seccion_val || 1), 1.5), 8);
      w_section_final = a_seccion_val * 2 * pxPerMmSection;
      h_section_final = a_seccion_val * 2 * pxPerMmSection;
    }

    const realTurns = (results && results.vueltas) ? results.vueltas : 500;
    const visualTurns = Math.min(realTurns, isBlueprint ? 180 : 360);

    return {
      r_final: r_final_clamped,
      w_coil: w_coil_final,
      w_section: w_section_final,
      h_section: h_section_final,
      d_real: d_real_val,
      numDispTurns: visualTurns,
      sectionType: currentSectionType
    };
  }, [inputs, results, isBlueprint]);

  if (!inputs) return null;

  // Cálculo de dasharray para el bobinado
  const visualPerimeter = 2 * Math.PI * r_final;
  const dashWidth = isBlueprint ? 1.5 : 1;
  const gapWidth = (visualPerimeter / numDispTurns) - dashWidth;
  const coilDashArray = `${dashWidth} ${Math.max(gapWidth, 0.5)}`;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
      style={{
        background: isBlueprint ? colors.bg : 'none',
        backgroundImage: isBlueprint ? 'none' : colors.bg,
        borderRadius: '8px',
        border: '1px solid #334155',
        transition: 'background 0.3s ease'
      }}
    >
      <defs>
        {/* Patrones Comunes */}
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.grid} strokeWidth="1" />
        </pattern>

        {/* Technical Hatching */}
        <pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" fill={colors.fillAccent} />
        </pattern>

        {/* Realistic Gradients */}
        <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#b87333" />
          <stop offset="25%" stopColor="#ffcfa3" />
          <stop offset="50%" stopColor="#b87333" />
          <stop offset="75%" stopColor="#8c531b" />
          <stop offset="100%" stopColor="#b87333" />
        </linearGradient>

        <linearGradient id="coreRealGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#333" />
          <stop offset="50%" stopColor="#111" />
          <stop offset="100%" stopColor="#000" />
        </linearGradient>

        {/* Marker flecha para cotas */}
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill={colors.dim} />
        </marker>
        <marker id="arrow-start" markerWidth="10" markerHeight="10" refX="1" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M9,0 L9,6 L0,3 z" fill={colors.dim} />
        </marker>
      </defs>

      {/* Fondo Grilla (Solo Blueprint) */}
      {isBlueprint && <rect width="100%" height="100%" fill="url(#grid)" />}

      {/* --- DIVIDER LINE --- */}
      <line x1="20" y1="320" x2={width - 20} y2="320" stroke={colors.divider} strokeWidth="1" strokeDasharray="4 4" />

      {/* --- VISTA SUPERIOR (TOROIDE) - ZONA SUPERIOR --- */}
      <g>
        {/* Núcleo (Base) */}
        <circle
          cx={centerX}
          cy={centerTopY}
          r={r_final}
          stroke={isBlueprint ? colors.stroke : "url(#coreRealGradient)"}
          strokeOpacity={colors.coreStrokeOpacity}
          fill="none"
          strokeWidth={w_coil}
          filter={!isBlueprint ? "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" : ""}
        />

        {/* Bobinado */}
        <circle
          cx={centerX}
          cy={centerTopY}
          r={r_final}
          stroke={colors.coilStroke}
          fill="none"
          strokeWidth={w_coil + (isBlueprint ? 4 : 2)}
          strokeDasharray={coilDashArray}
          opacity={colors.coilOpacity}
          style={{ mixBlendMode: isBlueprint ? 'normal' : 'lighten' }}
        />

        {/* Cota Diámetro Exterior (Siempre visible, color adaptado) */}
        <g id="dim-diameter">
          <path
            d={`M ${centerX - r_final - w_coil / 2 - 20} ${centerTopY} L ${centerX + r_final + w_coil / 2 + 20} ${centerTopY}`}
            stroke={colors.dim}
            strokeWidth="1"
            markerEnd="url(#arrow)"
            markerStart="url(#arrow-start)"
            opacity="0.7"
          />
          <rect x={centerX - 40} y={centerTopY - 10} width="80" height="20" fill={isBlueprint ? colors.bg : '#000'} opacity="0.6" />
          <text x={centerX} y={centerTopY + 5} textAnchor="middle" fill={colors.dim} fontSize="14" fontWeight="bold" fontFamily="monospace">
            ∅ {d_real.toFixed(1)} mm
          </text>
        </g>
      </g>


      {/* --- ZONA INFERIOR --- */}

      {/* 1. SECCIÓN TRANSVERSAL (Abajo Izquierda) */}
      <g transform={`translate(60, ${bottomSectionY})`}>
        <text x="0" y="-15" fill={colors.text} fontSize="12" fontWeight="bold" style={{ textTransform: 'uppercase' }}>SECCIÓN TÍPICA A-A ({sectionType === 'rectangular' ? '▭' : '◯'})</text>

        {sectionType === 'rectangular' ? (
          <>
            {/* Núcleo Rectangular */}
            <rect
              x="0"
              y="0"
              width={w_section}
              height={h_section}
              fill={isBlueprint ? "url(#hatch)" : "url(#coreRealGradient)"}
              stroke={isBlueprint ? colors.stroke : "#555"}
              strokeWidth={isBlueprint ? 2 : 1}
            />

            {/* Hilos de Bobinado - Lado izquierdo */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={`wire-l-${i}`}
                cx="-2"
                cy={(i * (h_section) / 7)}
                r={isBlueprint ? 3 : 2}
                fill={isBlueprint ? colors.bg : "#ffcfa3"}
                stroke={isBlueprint ? colors.stroke : "none"}
                strokeWidth="1.5"
              />
            ))}
            {/* Lado derecho */}
            {Array.from({ length: 8 }).map((_, i) => (
              <circle
                key={`wire-r-${i}`}
                cx={w_section + 2}
                cy={(i * (h_section) / 7)}
                r={isBlueprint ? 3 : 2}
                fill={isBlueprint ? colors.bg : "#ffcfa3"}
                stroke={isBlueprint ? colors.stroke : "none"}
                strokeWidth="1.5"
              />
            ))}

            {/* Cotas - Altura */}
            <path
              d={`M ${w_section + 15} 0 L ${w_section + 15} ${h_section}`}
              stroke={colors.dim}
              markerEnd="url(#arrow)"
              markerStart="url(#arrow-start)"
              opacity="0.6"
            />
            <text x={w_section + 25} y={h_section / 2} fill={colors.dim} fontSize="12" dominantBaseline="middle">
              H: {inputs.altura_nucleo_mm}mm
            </text>

            {/* Cotas - Ancho */}
            <path
              d={`M 0 ${h_section + 15} L ${w_section} ${h_section + 15}`}
              stroke={colors.dim}
              markerEnd="url(#arrow)"
              markerStart="url(#arrow-start)"
              opacity="0.6"
            />
            <text x={w_section / 2} y={h_section + 30} fill={colors.dim} fontSize="12" textAnchor="middle">
              W: {inputs.espesor_nucleo_mm}mm
            </text>
          </>
        ) : (
          <>
            {/* Núcleo Circular */}
            <ellipse
              cx={w_section / 2}
              cy={h_section / 2}
              rx={w_section / 2}
              ry={h_section / 2}
              fill={isBlueprint ? "url(#hatch)" : "url(#coreRealGradient)"}
              stroke={isBlueprint ? colors.stroke : "#555"}
              strokeWidth={isBlueprint ? 2 : 1}
            />

            {/* Hilos de Bobinado distribuidos radialmente */}
            {Array.from({ length: 16 }).map((_, i) => {
              const angle = (i / 16) * 2 * Math.PI;
              const r_wire = (w_section / 2) + 4;
              const wx = (w_section / 2) + r_wire * Math.cos(angle);
              const wy = (h_section / 2) + r_wire * Math.sin(angle);
              return (
                <circle
                  key={`wire-c-${i}`}
                  cx={wx}
                  cy={wy}
                  r={isBlueprint ? 3 : 2}
                  fill={isBlueprint ? colors.bg : "#ffcfa3"}
                  stroke={isBlueprint ? colors.stroke : "none"}
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Cota - Radio */}
            <path
              d={`M ${w_section / 2} ${h_section / 2} L ${w_section} ${h_section / 2}`}
              stroke={colors.dim}
              markerEnd="url(#arrow)"
              opacity="0.6"
            />
            <text x={w_section + 10} y={h_section / 2 + 4} fill={colors.dim} fontSize="12">
              r: {inputs.radio_seccion_mm}mm
            </text>
          </>
        )}
      </g>

      {/* 2. INFO BOX (Abajo Derecha) */}
      <g transform={`translate(${width - 230}, ${bottomSectionY})`}>
        <rect
          width="200"
          height="100"
          fill={isBlueprint ? "none" : "rgba(0,0,0,0.3)"}
          stroke={isBlueprint ? colors.grid : "#555"}
          strokeWidth="2"
          rx="4"
        />
        <text x="10" y="25" fill={colors.dim} fontSize="11" fontFamily="monospace">DENSIDAD BOBINADO:</text>
        {/* CORRECCIÓN: Cálculo explicito vueltas / milimetro */}
        <text x="10" y="45" fill={colors.text} fontSize="14" fontWeight="bold">
          {hasResults ? (results.vueltas / (Math.PI * d_real)).toFixed(1) : 0} vueltas/mm
        </text>

        <text x="10" y="70" fill={colors.dim} fontSize="11" fontFamily="monospace">CALIBRE:</text>
        <text x="10" y="90" fill={colors.text} fontSize="14" fontWeight="bold">
          ∅ {inputs.diametro_hilo_mm} mm
        </text>
      </g>

    </svg>
  );
};

export default RogowskiVisualizer;
