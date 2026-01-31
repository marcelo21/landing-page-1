import React, { useMemo } from 'react';

/**
 * RogowskiVisualizer
 * @description Renderiza un SVG técnico (Blueprint style) o Realista del toroide.
 * @param {string} visualMode - 'blueprint' | 'realistic'
 */
const RogowskiVisualizer = ({ inputs, results, visualMode = 'blueprint' }) => {
  // Dimensiones base
  const width = 600;
  const height = 500;
  const centerX = width / 2;
  const centerY = 220;

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
      coreStrokeOpacity: 0.3
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
      coreStrokeOpacity: 0.8
    }
  };

  const colors = isBlueprint ? THEME.blueprint : THEME.realistic;

  const hasResults = results && !results.error && results.vueltas > 0;

  // Cálculos de geometría visual
  const { r_final, w_visual, h_visual, d_real, numDispTurns } = useMemo(() => {
    const d_real_val = inputs.d_bobina_mm || (inputs.longitud_tira_mm / Math.PI) || 100;
    
    // Escala para que quepa en el canvas (max d ~350mm -> 300px)
    const pxPerMm = 280 / (d_real_val || 1);
    
    // Radios visuales
    const r_vis = (d_real_val / 2) * pxPerMm;
    const w_vis = (inputs.espesor_nucleo_mm || 10) * pxPerMm;
    const h_vis = (inputs.altura_nucleo_mm || 20) * pxPerMm;

    // Clamps para evitar roturas visuales extremas
    const r_final_clamped = Math.min(Math.max(r_vis, 60), 140);
    // Limitar espesor visual para que no tape todo
    const w_final_clamped = Math.min(Math.max(w_vis, 6), 40); 
    const h_final_clamped = Math.min(Math.max(h_vis, 10), 80);

    // Densidad visual
    const realTurns = results.vueltas || 500;
    // En modo realista dibujamos más lineas para textura
    const visualTurns = Math.min(realTurns, isBlueprint ? 180 : 360); 

    return {
      r_final: r_final_clamped,
      w_visual: w_final_clamped,
      h_visual: h_final_clamped,
      d_real: d_real_val,
      numDispTurns: visualTurns
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
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke={colors.grid} strokeWidth="1"/>
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

      {/* --- VISTA SUPERIOR (TOROIDE) --- */}
      <g>
        {/* Núcleo (Base) */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={r_final} 
          stroke={isBlueprint ? colors.stroke : "url(#coreRealGradient)"} 
          strokeOpacity={colors.coreStrokeOpacity}
          fill="none" 
          strokeWidth={w_visual} 
          filter={!isBlueprint ? "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" : ""}
        />
        
        {/* Bobinado */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={r_final} 
          stroke={colors.coilStroke} 
          fill="none" 
          strokeWidth={w_visual + (isBlueprint ? 4 : 2)} 
          strokeDasharray={coilDashArray}
          opacity={colors.coilOpacity}
          style={{ mixBlendMode: isBlueprint ? 'normal' : 'lighten' }}
        />

        {/* Cota Diámetro Exterior (Siempre visible, color adaptado) */}
        <g id="dim-diameter">
           <path 
             d={`M ${centerX - r_final - w_visual/2 - 20} ${centerY} L ${centerX + r_final + w_visual/2 + 20} ${centerY}`} 
             stroke={colors.dim} 
             strokeWidth="1"
             markerEnd="url(#arrow)"
             markerStart="url(#arrow-start)"
             opacity="0.7"
           />
           <rect x={centerX - 40} y={centerY - 10} width="80" height="20" fill={isBlueprint ? colors.bg : '#000'} opacity="0.6"/>
           <text x={centerX} y={centerY + 5} textAnchor="middle" fill={colors.dim} fontSize="14" fontWeight="bold" fontFamily="monospace">
             ∅ {d_real.toFixed(1)} mm
           </text>
        </g>
      </g>


      {/* --- VISTA SECCIÓN TRANSVERSAL (Abajo a la izquierda) --- */}
      <g transform={`translate(60, 380)`}>
         <text x="0" y="-20" fill={colors.text} fontSize="14" fontWeight="bold" style={{textTransform: 'uppercase'}}>Sección A-A</text>
         
         {/* Núcleo Rectangular */}
         <rect 
            x="0" 
            y="0" 
            width={w_visual * 2} 
            height={h_visual * 2} 
            fill={isBlueprint ? "url(#hatch)" : "url(#coreRealGradient)"} 
            stroke={isBlueprint ? colors.stroke : "#555"} 
            strokeWidth={isBlueprint ? 2 : 1} 
         />
         
         {/* Hilos de Bobinado (Círculos representativos) */}
         {/* Lado izquierdo */}
         {Array.from({ length: 8 }).map((_, i) => (
             <circle 
                key={`wire-l-${i}`}
                cx="-2" 
                cy={(i * (h_visual * 2) / 7)} 
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
                cx={w_visual * 2 + 2}
                cy={(i * (h_visual * 2) / 7)} 
                r={isBlueprint ? 3 : 2} 
                fill={isBlueprint ? colors.bg : "#ffcfa3"} 
                stroke={isBlueprint ? colors.stroke : "none"} 
                strokeWidth="1.5" 
             />
         ))}
         
         {/* Cotas Sección */}
         {/* Altura */}
         <path 
             d={`M ${w_visual * 2 + 15} 0 L ${w_visual * 2 + 15} ${h_visual * 2}`} 
             stroke={colors.dim} 
             markerEnd="url(#arrow)" 
             markerStart="url(#arrow-start)"
             opacity="0.6"
         />
         <text x={w_visual * 2 + 25} y={h_visual} fill={colors.dim} fontSize="12" dominantBaseline="middle">
            H: {inputs.altura_nucleo_mm}mm
         </text>

         {/* Ancho */}
         <path 
             d={`M 0 ${h_visual * 2 + 15} L ${w_visual * 2} ${h_visual * 2 + 15}`} 
             stroke={colors.dim} 
             markerEnd="url(#arrow)" 
             markerStart="url(#arrow-start)"
             opacity="0.6"
         />
         <text x={w_visual} y={h_visual * 2 + 30} fill={colors.dim} fontSize="12" textAnchor="middle">
            W: {inputs.espesor_nucleo_mm}mm
         </text>
      </g>

      {/* --- INFO BOX (Derecha Abajo) --- */}
      <g transform={`translate(${width - 220}, 380)`}>
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
