import React, { useState } from 'react';
import { useRogowskiLogic } from './useRogowskiLogic';
import RogowskiVisualizer from './RogowskiVisualizer';
import './RogowskiCalculator.css';

const RogowskiCalculator = ({ onClose }) => {
  const { inputMode, setInputMode, inputs, setInputs, results } = useRogowskiLogic();
  const [visualMode, setVisualMode] = useState('blueprint');

  const handleInputChange = (field, value) => {
    // Si el valor es una cadena vacía, actualizamos el estado con una cadena vacía
    if (value === "") {
        setInputs(prev => ({ ...prev, [field]: "" }));
        return;
    }
    // Si no, parseamos el valor. Si resulta NaN, usamos 0.
    setInputs(prev => ({ ...prev, [field]: parseFloat(value) }));
  };

  return (
    <div className="rogowski-overlay">
      <div className="rogowski-container">
        
        {/* HEADER */}
        <header className="rogowski-header">
          <h2><span>🌀</span> Rogowski Coil Designer</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </header>

        {/* COLUMNA IZQUIERDA: INPUTS */}
        <div className="rogowski-panel left">
          <h3 className="panel-title">Parámetros de Diseño</h3>
          
          {/* Toggle Diámetro vs Longitud */}
          <div className="toggle-group main-toggle">
            <button 
              className={`toggle-btn ${inputMode === 'diametro' ? 'active' : ''}`} 
              onClick={() => setInputMode('diametro')}
            >Diámetro Toroide</button>
             <button 
              className={`toggle-btn ${inputMode === 'longitud' ? 'active' : ''}`} 
              onClick={() => setInputMode('longitud')}
            >Largo Tira</button>
          </div>

          <div className="control-group">
            <label>Voltaje Objetivo (mV)</label>
            <input 
              className="rogowski-input" 
              type="number" 
              value={inputs.v_out_target_mv} 
              onChange={(e) => handleInputChange('v_out_target_mv', e.target.value)} 
            />
          </div>
          
           <div className="control-group">
            <label>Corriente Nominal (A)</label>
            <input 
              className="rogowski-input" 
              type="number" 
              value={inputs.i_rated} 
              onChange={(e) => handleInputChange('i_rated', e.target.value)} 
            />
          </div>

          <div className="control-group">
            <label>Frecuencia (Hz)</label>
            <input 
              className="rogowski-input" 
              type="number" 
              value={inputs.freq} 
              onChange={(e) => handleInputChange('freq', e.target.value)} 
            />
          </div>

          <h3 className="panel-title" style={{marginTop: '2rem'}}>Geometría</h3>
          
          {inputMode === 'diametro' ? (
             <div className="control-group">
              <label>Diámetro Toroide (mm)</label>
              <input 
                className="rogowski-input" 
                type="number" 
                value={inputs.d_bobina_mm || 0} 
                onChange={(e) => handleInputChange('d_bobina_mm', e.target.value)} 
              />
            </div>
          ) : (
             <div className="control-group">
              <label>Longitud Tira (mm)</label>
              <input 
                className="rogowski-input" 
                type="number" 
                value={inputs.longitud_tira_mm || 0} 
                onChange={(e) => handleInputChange('longitud_tira_mm', e.target.value)} 
              />
             </div>
          )}
          
          <div className="control-group">
            <label>Altura Núcleo (mm)</label>
            <input 
              className="rogowski-input" 
              type="number" 
              value={inputs.altura_nucleo_mm} 
              onChange={(e) => handleInputChange('altura_nucleo_mm', e.target.value)} 
            />
          </div>

          <div className="control-group">
            <label>Espesor Núcleo (mm)</label>
            <input 
              className="rogowski-input" 
              type="number" 
              value={inputs.espesor_nucleo_mm} 
              onChange={(e) => handleInputChange('espesor_nucleo_mm', e.target.value)} 
            />
          </div>

          <div className="control-group">
            <label>Diámetro Hilo (mm)</label>
            <input 
              className="rogowski-input" 
              type="number" 
              step="0.001"
              value={inputs.diametro_hilo_mm} 
              onChange={(e) => handleInputChange('diametro_hilo_mm', e.target.value)} 
            />
          </div>

        </div>

        {/* COLUMNA CENTRAL: VISUALIZADOR */}
        <div className="rogowski-panel center">
           <div style={{ position: 'absolute', top: 20, right: 20, zIndex: 10, display: 'flex', gap: 8 }}>
              <button 
                className={`toggle-btn ${visualMode === 'blueprint' ? 'active' : ''}`}
                onClick={() => setVisualMode('blueprint')}
                style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem', minWidth: 80 }}
              >
                📐 Técnico
              </button>
              <button 
                className={`toggle-btn ${visualMode === 'realistic' ? 'active' : ''}`}
                onClick={() => setVisualMode('realistic')}
                style={{ fontSize: '0.7rem', padding: '0.3rem 0.8rem', minWidth: 80 }}
              >
                🎥 Realista
              </button>
           </div>
          <RogowskiVisualizer inputs={inputs} results={results} visualMode={visualMode} />
        </div>

        {/* COLUMNA DERECHA: RESULTADOS */}
        <div className="rogowski-panel right">
           <h3 className="panel-title">Resultados de Fabricación</h3>
           
           {results.error ? (
               <div className="result-card error">
                 <div className="result-label">Estado</div>
                 <div className="result-value" style={{fontSize: '1rem'}}>ERROR: {results.error}</div>
               </div>
           ) : (
           <>
              <div className={`result-card ${results.es_viable ? 'viable' : 'error'}`}>
                <div className="result-label">Vueltas Totales (N)</div>
                <div className="result-value">{results.vueltas}</div>
                {!results.es_viable && <div style={{color: 'red', fontSize: '0.8rem', marginTop: 5}}>No cabe en la capa interna</div>}
              </div>

              <div className="result-card info">
                <div className="result-label">Longitud Hilo (Total)</div>
                <div className="result-value">{results.longitud_hilo_m.toFixed(2)} <span className="result-unit">m</span></div>
              </div>

              <div className="result-card info">
                <div className="result-label">Resistencia DC</div>
                <div className="result-value">{results.resistencia_ohm.toFixed(2)} <span className="result-unit">Ω</span></div>
              </div>

              <h3 className="panel-title" style={{marginTop: '2rem'}}>Parámetros de Bobinado</h3>
              
              <div className="result-card warning">
                 <div className="result-label">Paso de Bobinado</div>
                 <div className="result-value">{results.paso_sugerido_mm.toFixed(2)} <span className="result-unit">mm</span></div>
                 <div className="result-label" style={{marginTop: 5}}>Gap: {results.gap_sugerido_mm.toFixed(2)} mm</div>
              </div>
              
              <div className="result-card">
                 <div className="result-label">Inductancia Mutua</div>
                 <div className="result-value">{results.inductancia_mutua_nH.toFixed(2)} <span className="result-unit">nH</span></div>
              </div>
           </>
           )}
           
        </div>

      </div>
    </div>
  );
};

export default RogowskiCalculator;
