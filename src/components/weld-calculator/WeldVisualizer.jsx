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

    // Nut/Bolt dimensions
    const mSize = parseInt(projectionConfig.rosca.replace('M', ''));
    // Make them look a bit more realistic/stylized
    const partWidth = mSize * scale * 1.6; // Head width (across flats approx)
    const partHeight = mSize * scale * 0.7; // Head height
    const threadWidth = mSize * scale; // Thread diameter
    const threadLength = mSize * scale * 2.0; // Thread length

    // Chamfer size for "less square" look
    const chamfer = partHeight * 0.25;

    // Helper to draw a hex nut/bolt head side profile with chamfered top corners
    const drawHeadProfile = (x, y, w, h) => {
      // Points: Bottom-Left -> Top-Left(chamfer) -> Top-Right(chamfer) -> Bottom-Right -> Close
      return `
        M ${x} ${y + h} 
        L ${x} ${y + chamfer} 
        Q ${x} ${y} ${x + chamfer} ${y}
        L ${x + w - chamfer} ${y} 
        Q ${x + w} ${y} ${x + w} ${y + chamfer}
        L ${x + w} ${y + h} 
        Z
      `;
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
          stroke="#000" 
          strokeWidth="1"
          style={{ transition: 'all 0.3s ease' }}
        />

        {/* Hole lines in sheet (dashed to represent hidden/internal) */}
        <line 
          x1={centerX - threadWidth/2} y1={startY} 
          x2={centerX - threadWidth/2} y2={startY + t_chapa} 
          stroke="#000" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"
        />
        <line 
          x1={centerX + threadWidth/2} y1={startY} 
          x2={centerX + threadWidth/2} y2={startY + t_chapa} 
          stroke="#000" strokeWidth="1" strokeDasharray="3 2" opacity="0.5"
        />

        {projectionConfig.tipo === 'Tuerca' ? (
          <g>
            {/* Nut Body */}
            <path 
              d={drawHeadProfile(centerX - partWidth/2, startY - partHeight, partWidth, partHeight)}
              fill="#777"
              stroke="#333"
              strokeWidth="1.5"
            />
            
            {/* Inner hole lines in Nut */}
            <line 
              x1={centerX - threadWidth/2} y1={startY - partHeight} 
              x2={centerX - threadWidth/2} y2={startY} 
              stroke="#333" strokeWidth="1" 
            />
            <line 
              x1={centerX + threadWidth/2} y1={startY - partHeight} 
              x2={centerX + threadWidth/2} y2={startY} 
              stroke="#333" strokeWidth="1" 
            />
            
            {/* Thread indication lines inside nut */}
            <line 
              x1={centerX - threadWidth/2 + 2} y1={startY - partHeight} 
              x2={centerX - threadWidth/2 + 2} y2={startY} 
              stroke="#555" strokeWidth="0.5" 
            />
            <line 
              x1={centerX + threadWidth/2 - 2} y1={startY - partHeight} 
              x2={centerX + threadWidth/2 - 2} y2={startY} 
              stroke="#555" strokeWidth="0.5" 
            />
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
              fill="#666" 
              stroke="#333"
              rx="2"
            />
            
            {/* Thread texture */}
            {Array.from({ length: 6 }).map((_, i) => (
               <line 
                 key={i}
                 x1={centerX - threadWidth/2} 
                 y1={startY + (i+1) * (threadLength/7)} 
                 x2={centerX + threadWidth/2} 
                 y2={startY + (i+1) * (threadLength/7) + 3} 
                 stroke="#444" 
                 strokeWidth="1"
                 opacity="0.3"
               />
            ))}

             {/* Head (sitting on sheet) */}
            <path 
              d={drawHeadProfile(centerX - partWidth/2, startY - partHeight, partWidth, partHeight)}
              fill="#555" 
              stroke="#333"
              strokeWidth="1.5"
            />
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
        <text x={centerX - 130} y={startY + t_chapa/2} textAnchor="end" fill="#fff" fontSize="12">
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
