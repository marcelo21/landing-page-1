import React from 'react';

const WeldVisualizer = ({ mode, thicknesses, materialColor, projectionConfig }) => {
  // SVG ViewBox dimensions
  const width = 400;
  const height = 300;
  const centerX = width / 2;
  const centerY = height / 2;

  // Scale factor for visualization (pixels per mm)
  const scale = 20; 

  const renderSpot = () => {
    const t1 = thicknesses[0] * scale;
    const t2 = thicknesses[1] * scale;
    const totalHeight = t1 + t2;
    const startY = centerY - (totalHeight / 2);

    // Electrodes (simplified)
    const electrodeWidth = 40;
    const electrodeHeight = 60;

    return (
      <g>
        {/* Top Electrode */}
        <rect 
          x={centerX - electrodeWidth/2} 
          y={startY - electrodeHeight} 
          width={electrodeWidth} 
          height={electrodeHeight} 
          fill="#B87333" // Copper
          rx="5"
        />
        
        {/* Sheet 1 */}
        <rect 
          x={centerX - 100} 
          y={startY} 
          width={200} 
          height={t1} 
          fill={materialColor} 
          stroke="#000" 
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
          stroke="#000" 
          strokeWidth="1"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Nugget (Visual representation of weld) */}
        <ellipse 
          cx={centerX} 
          cy={startY + t1} 
          rx={15} 
          ry={8} 
          fill="url(#heatGradient)" 
          style={{ opacity: 0.8 }}
        />

        {/* Bottom Electrode */}
        <rect 
          x={centerX - electrodeWidth/2} 
          y={startY + totalHeight} 
          width={electrodeWidth} 
          height={electrodeHeight} 
          fill="#B87333" // Copper
          rx="5"
        />

        {/* Labels */}
        <text x={centerX - 110} y={startY + t1/2} textAnchor="end" fill="#fff" fontSize="12">
          {thicknesses[0]}mm
        </text>
        <text x={centerX - 110} y={startY + t1 + t2/2} textAnchor="end" fill="#fff" fontSize="12">
          {thicknesses[1]}mm
        </text>
      </g>
    );
  };

  const renderProjection = () => {
    const t_chapa = projectionConfig.t_chapa * scale;
    const startY = centerY;

    // Nut/Bolt dimensions (approximate based on M size)
    const mSize = parseInt(projectionConfig.rosca.replace('M', ''));
    const partWidth = mSize * scale * 1.5; 
    const partHeight = mSize * scale * 0.8;

    return (
      <g>
        {/* Sheet */}
        <rect 
          x={centerX - 100} 
          y={startY} 
          width={200} 
          height={t_chapa} 
          fill={materialColor} 
          stroke="#000" 
          strokeWidth="1"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Nut/Bolt */}
        {projectionConfig.tipo === 'Tuerca' ? (
          <path 
            d={`M ${centerX - partWidth/2} ${startY} 
                L ${centerX + partWidth/2} ${startY} 
                L ${centerX + partWidth/2} ${startY - partHeight} 
                L ${centerX - partWidth/2} ${startY - partHeight} Z`}
            fill="#555"
            stroke="#333"
          />
        ) : (
          // Bolt (Tornillo)
          <g>
             {/* Head */}
            <rect 
              x={centerX - partWidth/2} 
              y={startY - partHeight/2} 
              width={partWidth} 
              height={partHeight/2} 
              fill="#555" 
              stroke="#333"
            />
            {/* Thread */}
            <rect 
              x={centerX - (partWidth * 0.6)/2} 
              y={startY - partHeight * 2} 
              width={partWidth * 0.6} 
              height={partHeight * 1.5} 
              fill="#666" 
              stroke="#333"
            />
          </g>
        )}

        {/* Heat Zone */}
        <ellipse 
          cx={centerX} 
          cy={startY} 
          rx={partWidth/3} 
          ry={5} 
          fill="url(#heatGradient)" 
          style={{ opacity: 0.8 }}
        />

        {/* Labels */}
        <text x={centerX - 110} y={startY + t_chapa/2} textAnchor="end" fill="#fff" fontSize="12">
          {projectionConfig.t_chapa}mm
        </text>
        <text x={centerX} y={startY - partHeight - 10} textAnchor="middle" fill="#fff" fontSize="12">
          {projectionConfig.rosca} {projectionConfig.tipo}
        </text>
      </g>
    );
  };

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <radialGradient id="heatGradient">
          <stop offset="0%" stopColor="#ff4d4d" />
          <stop offset="50%" stopColor="#ff9933" />
          <stop offset="100%" stopColor="rgba(255, 153, 51, 0)" />
        </radialGradient>
      </defs>
      
      {/* Background Grid (Optional) */}
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" />

      {mode === 'spot' ? renderSpot() : renderProjection()}
    </svg>
  );
};

export default WeldVisualizer;
