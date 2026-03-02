import React from 'react';
import { useSpotStrengthLogic } from './useSpotStrengthLogic';
import SpotStrengthVisualizer from './SpotStrengthVisualizer';
import './SpotStrengthCalculator.css';

/**
 * SpotStrengthCalculator
 * @description Calculadora de estimación de fuerza de rotura en soldadura por puntos.
 * Implementa el modelo matemático de Analisis_esfuerzo.md con interfaz interactiva.
 * @param {function} onClose - Función para cerrar la calculadora
 * @returns {JSX.Element} Interfaz principal de la calculadora
 */
const SpotStrengthCalculator = ({ onClose }) => {
    const {
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
    } = useSpotStrengthLogic();

    const [showSecondary, setShowSecondary] = React.useState(false);

    return (
        <div className="spot-strength-overlay">
            <div className="spot-strength-container">
                {/* ── Header ── */}
                <header className="ssc-header">
                    <h2>
                        <span>🔬</span> Estimador de Fuerza de Rotura
                    </h2>
                    <button className="ssc-close-btn" onClick={onClose}>&times;</button>
                </header>

                {/* ══════════════════════════════════════
            LEFT PANEL — Configuration
            ══════════════════════════════════════ */}
                <div className="ssc-panel left">

                    {/* Material */}
                    <div className="ssc-control-group">
                        <label>Material</label>
                        <select
                            className="ssc-select"
                            value={materialKey}
                            onChange={(e) => setMaterialKey(e.target.value)}
                        >
                            {Object.entries(MATERIALS).map(([key, mat]) => (
                                <option key={key} value={key}>
                                    {mat.name} {key !== "7" ? `(${mat.uts} MPa)` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Custom UTS input */}
                    {materialKey === "7" && (
                        <div className="ssc-control-group">
                            <label>
                                σ_UTS: <span className="ssc-slider-value">{customUts} MPa</span>
                            </label>
                            <input
                                type="range"
                                className="ssc-slider"
                                min="100" max="1500" step="10"
                                value={customUts}
                                onChange={(e) => setCustomUts(parseFloat(e.target.value))}
                            />
                        </div>
                    )}

                    {/* Diameter */}
                    <div className="ssc-control-group">
                        <label>
                            Diámetro Botón (d): <span className="ssc-slider-value">{diameter} mm</span>
                        </label>
                        <input
                            type="range"
                            className="ssc-slider"
                            min="2" max="12" step="0.1"
                            value={diameter}
                            onChange={(e) => setDiameter(parseFloat(e.target.value))}
                        />
                    </div>

                    {/* Thickness */}
                    <div className="ssc-control-group">
                        <label>
                            Espesor Chapa Fina (t): <span className="ssc-slider-value">{thickness} mm</span>
                        </label>
                        <input
                            type="range"
                            className="ssc-slider"
                            min="0.5" max="5.0" step="0.1"
                            value={thickness}
                            onChange={(e) => setThickness(parseFloat(e.target.value))}
                        />
                    </div>

                    {/* Number of Sheets */}
                    <div className="ssc-control-group">
                        <label>Chapas Apiladas (N)</label>
                        <div className="ssc-toggle-group">
                            {[2, 3].map((n) => (
                                <button
                                    key={n}
                                    className={`ssc-toggle-btn ${numSheets === n ? 'active' : ''}`}
                                    onClick={() => setNumSheets(n)}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Correction Factors (Collapsible) ── */}
                    <button
                        className="ssc-factors-toggle"
                        onClick={() => setShowFactors(!showFactors)}
                    >
                        <span>Factores Correctivos (η)</span>
                        <span className={`ssc-chevron ${showFactors ? 'open' : ''}`}>▼</span>
                    </button>

                    <div className={`ssc-factors-body ${showFactors ? 'open' : ''}`}>
                        {/* η_c — Calidad */}
                        <div className="ssc-factor-item">
                            <label>
                                η Calidad Botón <span>{etaQuality.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                className="ssc-slider"
                                min="0.70" max="1.00" step="0.01"
                                value={etaQuality}
                                onChange={(e) => setEtaQuality(parseFloat(e.target.value))}
                            />
                        </div>

                        {/* η_a — Desalineación */}
                        <div className="ssc-factor-item">
                            <label>
                                η Desalineación <span>{etaAlignment.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                className="ssc-slider"
                                min="0.80" max="1.00" step="0.01"
                                value={etaAlignment}
                                onChange={(e) => setEtaAlignment(parseFloat(e.target.value))}
                            />
                        </div>

                        {/* η_p — Peel */}
                        <div className="ssc-factor-item">
                            <label>
                                η Modo Peel <span>{etaPeel.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                className="ssc-slider"
                                min="0.20" max="0.50" step="0.01"
                                value={etaPeel}
                                onChange={(e) => setEtaPeel(parseFloat(e.target.value))}
                            />
                        </div>

                        {/* η_proc — Proceso */}
                        <div className="ssc-factor-item">
                            <label>
                                η Proceso <span>{etaProcess.toFixed(2)}</span>
                            </label>
                            <input
                                type="range"
                                className="ssc-slider"
                                min="0.80" max="0.95" step="0.01"
                                value={etaProcess}
                                onChange={(e) => setEtaProcess(parseFloat(e.target.value))}
                            />
                        </div>

                        {/* Combined factor display */}
                        <div style={{
                            textAlign: 'center',
                            fontSize: '0.8rem',
                            color: 'var(--secondary-color)',
                            padding: '0.3rem 0',
                            borderTop: '1px solid var(--secondary-color)',
                            marginTop: '0.25rem'
                        }}>
                            η combinado: <strong style={{ color: 'var(--primary-color)' }}>
                                {results.eta_product.toFixed(4)}
                            </strong>
                        </div>
                    </div>
                </div>

                {/* ══════════════════════════════════════
            CENTER PANEL — Visualization
            ══════════════════════════════════════ */}
                <div className="ssc-panel center">
                    <SpotStrengthVisualizer
                        diameter={diameter}
                        thickness={thickness}
                        numSheets={numSheets}
                        materialColor={MATERIALS[materialKey].color}
                        results={results}
                    />
                </div>

                {/* ══════════════════════════════════════
            RIGHT PANEL — Results
            ══════════════════════════════════════ */}
                <div className="ssc-panel right ssc-results-panel">
                    <div className="ssc-results-content">
                        <div className="ssc-panel-header">
                            <h3 className="ssc-panel-title">Resultados del Análisis</h3>
                        </div>

                        {/* F_real — Primary result */}
                        <div className="ssc-result-card primary">
                            <div className="ssc-result-label">Fuerza Real Estimada</div>
                            <div className="ssc-result-value">
                                {results.F_real.toFixed(0)}
                                <span className="ssc-result-unit">N</span>
                            </div>
                            <div className="ssc-result-sub">
                                {(results.F_real / 1000).toFixed(2)} kN
                            </div>
                        </div>

                        {/* Collapsible Secondary Forces */}
                        <button
                            className="ssc-factors-toggle secondary-toggle"
                            onClick={() => setShowSecondary(!showSecondary)}
                        >
                            <span>Detalles de Carga</span>
                            <span className={`ssc-chevron ${showSecondary ? 'open' : ''}`}>▼</span>
                        </button>

                        <div className={`ssc-factors-body ${showSecondary ? 'open' : ''}`}>
                            {/* F_PO */}
                            <div className="ssc-result-card pullout">
                                <div className="ssc-result-label">Fuerza Arrancamiento (F_PO)</div>
                                <div className="ssc-result-value">
                                    {results.F_PO.toFixed(0)}
                                    <span className="ssc-result-unit">N</span>
                                </div>
                            </div>

                            {/* F_shear */}
                            <div className="ssc-result-card shear">
                                <div className="ssc-result-label">Fuerza Cizalladura (F_ciz)</div>
                                <div className="ssc-result-value">
                                    {results.F_shear.toFixed(0)}
                                    <span className="ssc-result-unit">N</span>
                                </div>
                            </div>
                        </div>

                        {/* Failure mode badge */}
                        <div className="ssc-result-card info">
                            <div className="ssc-result-label">Modo de Falla Predicho</div>
                            <div className={`ssc-badge ${results.failureSafe ? 'safe' : 'unsafe'}`}>
                                {results.failureSafe ? '✓' : '✗'} {results.failureMode}
                            </div>
                            <div className="ssc-result-sub">
                                τ_corte = {results.tau.toFixed(1)} MPa · d_min = {results.d_min.toFixed(2)} mm
                            </div>
                        </div>

                        {/* Status Banner */}
                        <div className={`ssc-status-banner ${results.status}`}>
                            {results.status === 'accepted' && '✅ '}
                            {results.status === 'warning' && '⚠️ '}
                            {results.status === 'rejected' && '❌ '}
                            {results.statusMessage}
                        </div>
                    </div>

                    {/* Engineering disclaimer - Sticky at bottom */}
                    <div className="ssc-disclaimer sticky-disclaimer">
                        ⚠️ ADVERTENCIA: Este modelo proporciona una estimación teórica analítica.
                        No sustituye al ensayo destructivo ni debe emplearse como única justificación
                        para decisiones de seguridad estructural. Ref: AWS D8.1 / ISO 10447.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpotStrengthCalculator;
