import React from 'react';

/**
 * WeldVisualizer
 * @description Componente de visualización SVG para la proyección de soldadura
 * Renderiza dinámicamente las chapas y la proyección según los parámetros
 * @param {string} mode - Modo de soldadura ('projection' o 'spot')
 * @param {Object} thicknesses - Espesores de las chapas {t1, t2}
 * @param {string} materialColor - Color hexadecimal del material seleccionado
 * @param {Object} projectionConfig - Configuración calculada de la proyección {h, d, etc.}
 * @returns {JSX.Element} Gráfico SVG interactivo
 */
const WeldVisualizer = ({ mode, thicknesses, materialColor, projectionConfig }) => {
  // SVG ViewBox dimensions
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;

  // Scale factor for visualization (pixels per mm)
  const scale = 20; 

  // Helper to determine contrasting stroke color
  const getStrokeColor = (hexColor) => {
    // Convert hex to RGB
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    // Calculate luminance
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    // Return black for light colors, white (or light grey) for dark colors
    return yiq >= 128 ? '#333333' : '#cccccc';
  };

  const strokeColor = getStrokeColor(materialColor || '#333333');

  const renderElectrode = (x, y, width, height, isTop) => {
    const tipHeight = 10;
    const bodyHeight = height - tipHeight;
    
    // Points for the electrode shape
    // Top electrode: Body rect + Tapered tip pointing down
    // Bottom electrode: Tapered tip pointing up + Body rect
    
    let d = '';
    if (isTop) {
      // Body
      d = `M ${x} ${y} 
           L ${x + width} ${y} 
           L ${x + width} ${y + bodyHeight} 
           L ${x + width * 0.8} ${y + height} 
           L ${x + width * 0.2} ${y + height} 
           L ${x} ${y + bodyHeight} 
           Z`;
    } else {
      // Bottom
      d = `M ${x + width * 0.2} ${y} 
           L ${x + width * 0.8} ${y} 
           L ${x + width} ${y + tipHeight} 
           L ${x + width} ${y + height} 
           L ${x} ${y + height} 
           L ${x} ${y + tipHeight} 
           Z`;
    }

    return (
      <g>
        <path d={d} fill="url(#copperGradient)" stroke="#8B4513" strokeWidth="1" />
        {/* Shine effect */}
        <path 
          d={isTop 
            ? `M ${x + 5} ${y} L ${x + 5} ${y + bodyHeight} L ${x + width * 0.2 + 2} ${y + height}`
            : `M ${x + width * 0.2 + 2} ${y} L ${x + 5} ${y + tipHeight} L ${x + 5} ${y + height}`
          }
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="3"
          fill="none"
        />
      </g>
    );
  };

  const renderSpot = () => {
    const t1 = thicknesses[0] * scale;
    const t2 = thicknesses[1] * scale;
    const t3 = (thicknesses[2] || 0) * scale;
    const totalHeight = t1 + t2 + t3;
    const startY = centerY - (totalHeight / 2);

    // Electrodes
    const electrodeWidth = 40;
    const electrodeHeight = 80;

    return (
      <g>
        {/* Top Electrode */}
        {renderElectrode(centerX - electrodeWidth/2, startY - electrodeHeight, electrodeWidth, electrodeHeight, true)}
        
        {/* Sheet 1 */}
        <rect 
          x={centerX - 100} 
          y={startY} 
          width={200} 
          height={t1} 
          fill={materialColor} 
          stroke={strokeColor}
          strokeWidth="1"
          style={{ transition: 'all 0.3s ease' }}
        />
        
        {/* Sheet 2 */}
        <rect 
          x={centerX - 100} 
          y={startY + t1} 
          width={200} 
          height={t2} 
          fill={materialColor} 
          stroke={strokeColor}
          strokeWidth="1"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Sheet 3 */}
        {t3 > 0 && (
          <rect 
            x={centerX - 100} 
            y={startY + t1 + t2} 
            width={200} 
            height={t3} 
            fill={materialColor} 
            stroke={strokeColor}
            strokeWidth="1"
            style={{ transition: 'all 0.3s ease' }}
          />
        )}

        {/* Nugget 1 (between 1 and 2) */}
        <ellipse 
          cx={centerX} 
          cy={startY + t1} 
          rx={15} 
          ry={8} 
          fill="url(#heatGradient)" 
          style={{ opacity: 0.8 }}
        />

        {/* Nugget 2 (between 2 and 3) */}
        {t3 > 0 && (
          <ellipse 
            cx={centerX} 
            cy={startY + t1 + t2} 
            rx={15} 
            ry={8} 
            fill="url(#heatGradient)" 
            style={{ opacity: 0.8 }}
          />
        )}

        {/* Bottom Electrode */}
        {renderElectrode(centerX - electrodeWidth/2, startY + totalHeight, electrodeWidth, electrodeHeight, false)}

        {/* Labels */}
        <text x={centerX - 110} y={startY + t1/2} textAnchor="end" fill="currentColor" fontSize="12">
          {thicknesses[0]}mm
        </text>
        <text x={centerX - 110} y={startY + t1 + t2/2} textAnchor="end" fill="currentColor" fontSize="12">
          {thicknesses[1]}mm
        </text>
        {t3 > 0 && (
          <text x={centerX - 110} y={startY + t1 + t2 + t3/2} textAnchor="end" fill="currentColor" fontSize="12">
            {thicknesses[2]}mm
          </text>
        )}
      </g>
    );
  };

  const renderProjection = () => {
    const t_chapa = projectionConfig.t_chapa * scale;
    const startY = centerY;

    // Nut/Bolt dimensions
    const mSize = parseInt(projectionConfig.rosca.replace('M', ''));
    // Make them look a bit more realistic/stylized
    const partWidth = mSize * scale * 1.8; // Head width (across flats approx)
    const partHeight = mSize * scale * 0.8; // Head height
    const threadWidth = mSize * scale; // Thread diameter
    const threadLength = mSize * scale * 2.0; // Thread length

    // Helper to draw a 3D-looking hex head
    const drawHexHead = (x, y, w, h) => {
      const quarterW = w / 4;
      
      // We draw 3 vertical strips to simulate the hex faces seen from side
      // Left Face
      const leftPath = `M ${x} ${y + h*0.1} L ${x + quarterW} ${y} L ${x + quarterW} ${y + h} L ${x} ${y + h} Z`;
      // Center Face
      const centerPath = `M ${x + quarterW} ${y} L ${x + w - quarterW} ${y} L ${x + w - quarterW} ${y + h} L ${x + quarterW} ${y + h} Z`;
      // Right Face
      const rightPath = `M ${x + w - quarterW} ${y} L ${x + w} ${y + h*0.1} L ${x + w} ${y + h} L ${x + w - quarterW} ${y + h} Z`;

      return (
        <g>
          <path d={leftPath} fill="url(#steelGradientDark)" stroke="#333" strokeWidth="0.5" />
          <path d={centerPath} fill="url(#steelGradientLight)" stroke="#333" strokeWidth="0.5" />
          <path d={rightPath} fill="url(#steelGradientDark)" stroke="#333" strokeWidth="0.5" />
          {/* Top chamfer highlight */}
          <path d={`M ${x} ${y + h*0.1} Q ${x + w/2} ${y - h*0.1} ${x + w} ${y + h*0.1}`} fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
        </g>
      );
    };

    return (
      <g>
        {/* Sheet */}
        <rect 
          x={centerX - 120} 
          y={startY} 
          width={240} 
          height={t_chapa} 
          fill={materialColor} 
          stroke={strokeColor}
          strokeWidth="1"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Hole lines in sheet (dashed to represent hidden/internal) */}
        <line 
          x1={centerX - threadWidth/2} y1={startY} 
          x2={centerX - threadWidth/2} y2={startY + t_chapa} 
          stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" opacity="0.5"
        />
        <line 
          x1={centerX + threadWidth/2} y1={startY} 
          x2={centerX + threadWidth/2} y2={startY + t_chapa} 
          stroke={strokeColor} strokeWidth="1" strokeDasharray="3 2" opacity="0.5"
        />

        {projectionConfig.tipo === 'Tuerca' ? (
          <g>
            {/* Nut Body */}
            {drawHexHead(centerX - partWidth/2, startY - partHeight, partWidth, partHeight)}
            
            {/* Inner hole lines in Nut */}
            <line 
              x1={centerX - threadWidth/2} y1={startY - partHeight} 
              x2={centerX - threadWidth/2} y2={startY} 
              stroke="#333" strokeWidth="1" opacity="0.3"
            />
            <line 
              x1={centerX + threadWidth/2} y1={startY - partHeight} 
              x2={centerX + threadWidth/2} y2={startY} 
              stroke="#333" strokeWidth="1" opacity="0.3"
            />
            
            {/* Thread indication lines inside nut */}
            {Array.from({ length: 4 }).map((_, i) => (
               <line 
                 key={i}
                 x1={centerX - threadWidth/2 + 2} 
                 y1={startY - partHeight + (i+1) * (partHeight/5)} 
                 x2={centerX + threadWidth/2 - 2} 
                 y2={startY - partHeight + (i+1) * (partHeight/5) + 2} 
                 stroke="#333" 
                 strokeWidth="0.5"
                 opacity="0.3"
               />
            ))}
          </g>
        ) : (
          // Bolt (Tornillo)
          <g>
             {/* Thread (going down through sheet) */}
             <rect 
              x={centerX - threadWidth/2} 
              y={startY} 
              width={threadWidth} 
              height={threadLength} 
              fill="url(#boltBodyGradient)" 
              stroke="#333"
              strokeWidth="1"
              rx="2"
            />
            
            {/* Thread texture */}
            {Array.from({ length: 8 }).map((_, i) => (
               <path 
                 key={i}
                 d={`M ${centerX - threadWidth/2} ${startY + (i+1) * (threadLength/9)} 
                     L ${centerX + threadWidth/2} ${startY + (i+1) * (threadLength/9) + 4}`}
                 stroke="rgba(0,0,0,0.3)" 
                 strokeWidth="1"
                 fill="none"
               />
            ))}

             {/* Head (sitting on sheet) */}
             {drawHexHead(centerX - partWidth/2, startY - partHeight, partWidth, partHeight)}
          </g>
        )}

        {/* Heat Zone */}
        <ellipse 
          cx={centerX} 
          cy={startY} 
          rx={partWidth/2.5} 
          ry={4} 
          fill="url(#heatGradient)" 
          style={{ opacity: 0.8, mixBlendMode: 'screen' }}
        />

        {/* Labels */}
        <text x={centerX - 130} y={startY + t_chapa/2} textAnchor="end" fill="currentColor" fontSize="12">
          {projectionConfig.t_chapa}mm
        </text>
        <text x={centerX} y={startY - partHeight - 10} textAnchor="middle" fill="currentColor" fontSize="12">
          {projectionConfig.rosca} {projectionConfig.tipo}
        </text>
      </g>
    );
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet" style={{ color: 'var(--text-color)' }}>
      <defs>
        <radialGradient id="heatGradient">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="50%" stopColor="#ff9933" />
          <stop offset="100%" stopColor="rgba(255, 153, 51, 0)" />
        </radialGradient>
        <linearGradient id="copperGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B4513" />
          <stop offset="20%" stopColor="#B87333" />
          <stop offset="50%" stopColor="#CD853F" />
          <stop offset="80%" stopColor="#B87333" />
          <stop offset="100%" stopColor="#8B4513" />
        </linearGradient>
        <linearGradient id="steelGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#888" />
          <stop offset="50%" stopColor="#e0e0e0" />
          <stop offset="100%" stopColor="#888" />
        </linearGradient>
        <linearGradient id="steelGradientDark" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#555" />
          <stop offset="50%" stopColor="#999" />
          <stop offset="100%" stopColor="#555" />
        </linearGradient>
        <linearGradient id="boltBodyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#333" />
          <stop offset="30%" stopColor="#777" />
          <stop offset="50%" stopColor="#ccc" />
          <stop offset="80%" stopColor="#777" />
          <stop offset="100%" stopColor="#333" />
        </linearGradient>
      </defs>
      
      {/* Background Grid (Optional) */}
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {mode === 'spot' ? renderSpot() : renderProjection()}
    </svg>
  );
};

export default WeldVisualizer;
