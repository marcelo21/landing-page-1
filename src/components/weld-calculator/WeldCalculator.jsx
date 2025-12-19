import React from 'react';
import { useWeldLogic } from './useWeldLogic';
import WeldVisualizer from './WeldVisualizer';
import './WeldCalculator.css';

const WeldCalculator = ({ onClose }) => {
  const {
    mode, setMode,
    materialKey, setMaterialKey,
    thicknesses, setThicknesses,
    projectionConfig, setProjectionConfig,
    results,
    MATERIALS,
    PROJECTION_DATA
  } = useWeldLogic();

  const handleThicknessChange = (index, value) => {
    const newThicknesses = [...thicknesses];
    newThicknesses[index] = parseFloat(value);
    setThicknesses(newThicknesses);
  };

  return (
    <div className="weld-calculator-overlay">
      <div className="weld-calculator-container">
        {/* Header */}
        <header className="weld-header">
          <h2>
            <span>⚡</span> WeldMaster Pro
          </h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        {/* Left Panel: Configuration */}
        <div className="weld-panel left">
          <div className="mode-toggle">
            <button 
              className={`mode-btn ${mode === 'spot' ? 'active' : ''}`}
              onClick={() => setMode('spot')}
            >
              Puntos
            </button>
            <button 
              className={`mode-btn ${mode === 'projection' ? 'active' : ''}`}
              onClick={() => setMode('projection')}
            >
              Proyección
            </button>
          </div>

          <div className="control-group">
            <label>Material</label>
            <select 
              className="weld-select"
              value={materialKey}
              onChange={(e) => setMaterialKey(e.target.value)}
            >
              {Object.entries(MATERIALS).map(([key, mat]) => (
                <option key={key} value={key}>{mat.name}</option>
              ))}
            </select>
          </div>

          {mode === 'spot' ? (
            <>
              <div className="control-group">
                <label>Espesor Chapa 1: {thicknesses[0]} mm</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0.5" max="5.0" step="0.1"
                    value={thicknesses[0]}
                    onChange={(e) => handleThicknessChange(0, e.target.value)}
                    className="weld-slider"
                  />
                </div>
              </div>
              <div className="control-group">
                <label>Espesor Chapa 2: {thicknesses[1]} mm</label>
                <div className="slider-container">
                  <input 
                    type="range" 
                    min="0.5" max="5.0" step="0.1"
                    value={thicknesses[1]}
                    onChange={(e) => handleThicknessChange(1, e.target.value)}
                    className="weld-slider"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="control-group">
                <label>Rosca</label>
                <select 
                  className="weld-select"
                  value={projectionConfig.rosca}
                  onChange={(e) => setProjectionConfig({...projectionConfig, rosca: e.target.value})}
                >
                  {Object.keys(PROJECTION_DATA).map(k => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
              </div>
              <div className="control-group">
                <label>Tipo</label>
                <select 
                  className="weld-select"
                  value={projectionConfig.tipo}
                  onChange={(e) => setProjectionConfig({...projectionConfig, tipo: e.target.value})}
                >
                  <option value="Tuerca">Tuerca</option>
                  <option value="Tornillo">Tornillo</option>
                </select>
              </div>
              <div className="control-group">
                <label>Espesor Base: {projectionConfig.t_chapa} mm</label>
                <input 
                  type="range" 
                  min="0.5" max="5.0" step="0.1"
                  value={projectionConfig.t_chapa}
                  onChange={(e) => setProjectionConfig({...projectionConfig, t_chapa: parseFloat(e.target.value)})}
                  className="weld-slider"
                />
              </div>
            </>
          )}
        </div>

        {/* Center Panel: Visualization */}
        <div className="weld-panel center">
          <WeldVisualizer 
            mode={mode}
            thicknesses={thicknesses}
            materialColor={results.materialColor}
            projectionConfig={projectionConfig}
          />
        </div>

        {/* Right Panel: Results */}
        <div className="weld-panel right">
          <div className="result-card current">
            <div className="result-label">Intensidad</div>
            <div className="result-value">
              {results.current.toFixed(2)}<span className="result-unit">kA</span>
            </div>
          </div>

          <div className="result-card force">
            <div className="result-label">Fuerza Electrodos</div>
            <div className="result-value">
              {results.force.toFixed(2)}<span className="result-unit">kN</span>
            </div>
          </div>

          <div className="result-card time">
            <div className="result-label">Tiempo Soldadura</div>
            <div className="result-value">
              {results.time.toFixed(0)}<span className="result-unit">ciclos</span>
            </div>
          </div>

          {mode === 'spot' && (
            <div className="result-card info">
              <div className="result-label">Datos Calidad</div>
              <div style={{ fontSize: '0.9rem', color: '#c0caf5', marginTop: '0.5rem' }}>
                <div>Nugget Min: <strong>{results.nuggetMin?.toFixed(2)} mm</strong></div>
                <div>Punta Electrodo: <strong>{results.electrode?.toFixed(2)} mm</strong></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WeldCalculator;
