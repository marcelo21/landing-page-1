import React from 'react';

/**
 * SpotStrengthVisualizer
 * @description Visualización SVG interactiva de la sección transversal del punto
 * de soldadura. Muestra chapas, botón (nugget), fuerzas, ZAC y estado de falla.
 * @param {number} diameter - Diámetro del botón (mm)
 * @param {number} thickness - Espesor de la chapa más fina (mm)
 * @param {number} numSheets - Número de chapas apiladas
 * @param {string} materialColor - Color hex del material
 * @param {Object} results - Resultados del cálculo (del hook)
 * @returns {JSX.Element} Gráfico SVG
 */
const SpotStrengthVisualizer = ({ diameter, thickness, numSheets, materialColor, results }) => {
    const width = 500;
    const height = 400;
    const cx = width / 2;
    const cy = height / 2 - 10;

    // Escalas
    const scale = 18;
    const tPx = Math.max(thickness * scale, 12);
    const dPx = Math.max(diameter * scale * 0.6, 20);
    const nuggetRy = tPx * 0.55;

    const n = numSheets;
    const totalH = tPx * n;
    const startY = cy - totalH / 2;

    // Colors
    const safeColor = '#9ece6a';
    const unsafeColor = '#f7768e';
    const nuggetColor = results.failureSafe ? safeColor : unsafeColor;

    // Stroke for material
    const getStrokeColor = (hex) => {
        const r = parseInt(hex.substr(1, 2), 16);
        const g = parseInt(hex.substr(3, 2), 16);
        const b = parseInt(hex.substr(5, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return yiq >= 128 ? '#333333' : '#cccccc';
    };
    const strokeCol = getStrokeColor(materialColor || '#555555');

    // Force arrow
    const arrowLen = 50;
    const arrowY = cy;

    // Gauge bar position
    const gaugeX = 40;
    const gaugeW = 16;
    const gaugeH = totalH + 60;
    const gaugeY = startY - 30;
    const ratio = Math.min(results.strengthRatio, 2.0);
    const gaugeFill = ratio > 0 ? Math.min(ratio / 2, 1) * gaugeH : 0;

    return (
        <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="xMidYMid meet"
            style={{ color: 'var(--text-color)' }}
        >
            <defs>
                {/* Heat zone gradient */}
                <radialGradient id="ssc-heatGrad">
                    <stop offset="0%" stopColor="#ff4d4d" />
                    <stop offset="50%" stopColor="#ff9933" />
                    <stop offset="100%" stopColor="rgba(255,153,51,0)" />
                </radialGradient>

                {/* Nugget gradient based on safety */}
                <radialGradient id="ssc-nuggetGrad">
                    <stop offset="0%" stopColor={nuggetColor} stopOpacity="0.9" />
                    <stop offset="70%" stopColor={nuggetColor} stopOpacity="0.4" />
                    <stop offset="100%" stopColor={nuggetColor} stopOpacity="0" />
                </radialGradient>

                {/* Gauge gradient */}
                <linearGradient id="ssc-gaugeGrad" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#f7768e" />
                    <stop offset="50%" stopColor="#e0af68" />
                    <stop offset="100%" stopColor="#9ece6a" />
                </linearGradient>

                {/* Steel hatch pattern */}
                <pattern id="ssc-steelHatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                    <line x1="0" y1="0" x2="0" y2="6" stroke={strokeCol} strokeWidth="0.5" strokeOpacity="0.15" />
                </pattern>

                {/* Arrow marker */}
                <marker id="ssc-arrowRight" viewBox="0 0 10 10" refX="10" refY="5"
                    markerWidth="8" markerHeight="8" orient="auto-start-auto">
                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#f7768e" />
                </marker>
                <marker id="ssc-arrowLeft" viewBox="0 0 10 10" refX="0" refY="5"
                    markerWidth="8" markerHeight="8" orient="auto-start-auto">
                    <path d="M 10 0 L 0 5 L 10 10 z" fill="#f7768e" />
                </marker>
            </defs>

            {/* Background Grid */}
            <pattern id="ssc-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeOpacity="0.07" strokeWidth="1" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#ssc-grid)" />

            {/* ── Strength Ratio Gauge (left side) ── */}
            <g>
                <rect x={gaugeX} y={gaugeY} width={gaugeW} height={gaugeH}
                    rx="4" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
                <rect x={gaugeX + 2} y={gaugeY + gaugeH - gaugeFill + 2}
                    width={gaugeW - 4} height={Math.max(gaugeFill - 4, 0)}
                    rx="3" fill="url(#ssc-gaugeGrad)" opacity="0.8"
                    style={{ transition: 'all 0.4s ease' }} />
                {/* Threshold line at ratio=1 (halfway) */}
                <line x1={gaugeX - 4} y1={gaugeY + gaugeH / 2}
                    x2={gaugeX + gaugeW + 4} y2={gaugeY + gaugeH / 2}
                    stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="3 2" />
                <text x={gaugeX + gaugeW / 2} y={gaugeY - 8}
                    textAnchor="middle" fill="currentColor" fontSize="9" fontWeight="600" opacity="0.6">
                    F_PO/F_ciz
                </text>
                <text x={gaugeX + gaugeW / 2} y={gaugeY + gaugeH + 14}
                    textAnchor="middle" fill={nuggetColor} fontSize="10" fontWeight="700"
                    style={{ transition: 'fill 0.3s' }}>
                    {results.strengthRatio.toFixed(2)}
                </text>
            </g>

            {/* ── Sheets ── */}
            {Array.from({ length: n }).map((_, i) => (
                <g key={i}>
                    <rect
                        x={cx - 130}
                        y={startY + i * tPx}
                        width={260}
                        height={tPx}
                        fill={materialColor}
                        stroke={strokeCol}
                        strokeWidth="1"
                        style={{ transition: 'all 0.3s ease' }}
                    />
                    {/* Hatch overlay */}
                    <rect
                        x={cx - 130}
                        y={startY + i * tPx}
                        width={260}
                        height={tPx}
                        fill="url(#ssc-steelHatch)"
                        style={{ transition: 'all 0.3s ease' }}
                    />
                    {/* Thickness label */}
                    <text
                        x={cx + 140}
                        y={startY + i * tPx + tPx / 2 + 4}
                        textAnchor="start"
                        fill="currentColor"
                        fontSize="10"
                        fontWeight="500"
                        opacity="0.8"
                    >
                        t = {thickness} mm
                    </text>
                </g>
            ))}

            {/* ── Nuggets (at interfaces between sheets) ── */}
            {Array.from({ length: n - 1 }).map((_, i) => (
                <g key={`nugget-${i}`}>
                    {/* Zona Afectada por el Calor (ZAC) */}
                    <ellipse
                        cx={cx}
                        cy={startY + (i + 1) * tPx}
                        rx={dPx * 0.8}
                        ry={nuggetRy * 1.4}
                        fill="url(#ssc-heatGrad)"
                        opacity="0.25"
                        style={{ transition: 'all 0.4s ease' }}
                    />
                    {/* Nugget (botón de soldadura) */}
                    <ellipse
                        cx={cx}
                        cy={startY + (i + 1) * tPx}
                        rx={dPx / 2}
                        ry={nuggetRy}
                        fill="url(#ssc-nuggetGrad)"
                        stroke={nuggetColor}
                        strokeWidth="1.5"
                        strokeOpacity="0.6"
                        style={{ transition: 'all 0.4s ease' }}
                    />
                </g>
            ))}

            {/* ── Diameter annotation ── */}
            <g>
                <line
                    x1={cx - dPx / 2} y1={startY + totalH + 16}
                    x2={cx + dPx / 2} y2={startY + totalH + 16}
                    stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"
                />
                {/* End ticks */}
                <line
                    x1={cx - dPx / 2} y1={startY + totalH + 10}
                    x2={cx - dPx / 2} y2={startY + totalH + 22}
                    stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"
                />
                <line
                    x1={cx + dPx / 2} y1={startY + totalH + 10}
                    x2={cx + dPx / 2} y2={startY + totalH + 22}
                    stroke="currentColor" strokeWidth="1" strokeOpacity="0.5"
                />
                <text
                    x={cx} y={startY + totalH + 34}
                    textAnchor="middle" fill="currentColor" fontSize="11" fontWeight="600"
                >
                    d = {diameter} mm
                </text>
                {/* d_min reference */}
                <text
                    x={cx} y={startY + totalH + 48}
                    textAnchor="middle"
                    fill={results.status === 'accepted' ? '#9ece6a' : results.status === 'warning' ? '#e0af68' : '#f7768e'}
                    fontSize="9" fontWeight="500"
                    style={{ transition: 'fill 0.3s' }}
                >
                    d_min = {results.d_min.toFixed(2)} mm
                </text>
            </g>

            {/* ── Shear Force Arrows ── */}
            <g opacity="0.85">
                {/* Left arrow (pushing right) */}
                <line
                    x1={cx - 130 - arrowLen} y1={startY + tPx / 2}
                    x2={cx - 135} y2={startY + tPx / 2}
                    stroke="#f7768e" strokeWidth="2.5"
                    markerEnd="url(#ssc-arrowRight)"
                    style={{ transition: 'all 0.3s' }}
                />
                <text
                    x={cx - 130 - arrowLen - 4} y={startY + tPx / 2 + 4}
                    textAnchor="end" fill="#f7768e" fontSize="10" fontWeight="600"
                >
                    F
                </text>

                {/* Right arrow (pushing left) - for the bottom sheet (if N=2) or last interface */}
                <line
                    x1={cx + 130 + arrowLen} y1={startY + totalH - tPx / 2}
                    x2={cx + 135} y2={startY + totalH - tPx / 2}
                    stroke="#f7768e" strokeWidth="2.5"
                    markerEnd="url(#ssc-arrowLeft)"
                    style={{ transition: 'all 0.3s' }}
                />
                <text
                    x={cx + 130 + arrowLen + 4} y={startY + totalH - tPx / 2 + 4}
                    textAnchor="start" fill="#f7768e" fontSize="10" fontWeight="600"
                >
                    F
                </text>
            </g>

            {/* ── Failure mode indicator ── */}
            <g>
                <rect
                    x={cx - 65} y={startY - 36}
                    width={130} height={22}
                    rx="11"
                    fill={results.failureSafe ? 'rgba(158,206,106,0.12)' : 'rgba(247,118,142,0.12)'}
                    stroke={nuggetColor}
                    strokeWidth="1"
                    strokeOpacity="0.4"
                    style={{ transition: 'all 0.3s' }}
                />
                <text
                    x={cx} y={startY - 21}
                    textAnchor="middle"
                    fill={nuggetColor}
                    fontSize="10"
                    fontWeight="700"
                    style={{ transition: 'fill 0.3s' }}
                >
                    {results.failureSafe ? '✓ Arrancamiento' : '✗ Falla Interfacial'}
                </text>
            </g>

            {/* ── N sheets label ── */}
            <text x={cx - 140} y={startY - 10}
                textAnchor="start" fill="currentColor" fontSize="10" fontWeight="600" opacity="0.6">
                N = {numSheets}
            </text>
        </svg>
    );
};

export default SpotStrengthVisualizer;
