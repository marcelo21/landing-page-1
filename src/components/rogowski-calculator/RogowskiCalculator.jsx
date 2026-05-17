import React, { useState } from 'react';
import { useRogowskiLogic } from './useRogowskiLogic';
import RogowskiVisualizer from './RogowskiVisualizer';
import './RogowskiCalculator.css';

const RogowskiCalculator = ({ onClose }) => {
  const { inputMode, setInputMode, sectionType, setSectionType, sensitivityMode, setSensitivityMode, inputs, setInputs, results } = useRogowskiLogic();
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

  const generateTextReport = () => {
    const date = new Date().toLocaleString();
    let report = `=========================================\n`;
    report += `    REPORTE DE DISEÑO: BOBINA DE ROGOWSKI\n`;
    report += `=========================================\n`;
    report += `Fecha: ${date}\n\n`;

    report += `--- PARÁMETROS DE DISEÑO ---\n`;
    if (inputMode === 'diametro') {
      report += `Diámetro del Toroide: ${inputs.d_bobina_mm || 0} mm\n`;
    } else {
      report += `Longitud de Tira: ${inputs.longitud_tira_mm || 0} mm\n`;
    }

    if (sensitivityMode === 'voltage_current') {
      report += `Voltaje Ref: ${inputs.v_out_target_mv} mV\n`;
      report += `Corriente Ref: ${inputs.i_rated} A\n`;
    } else {
      report += `Sensibilidad: ${inputs.sensitivity_mv_a} mV/A\n`;
    }
    report += `Frecuencia: ${inputs.freq} Hz\n`;

    if (sectionType === 'rectangular') {
      report += `Sección: Rectangular\n`;
      report += `Altura Núcleo: ${inputs.altura_nucleo_mm} mm\n`;
      report += `Espesor Núcleo: ${inputs.espesor_nucleo_mm} mm\n`;
    } else {
      report += `Sección: Circular\n`;
      report += `Radio Sección: ${inputs.radio_seccion_mm} mm\n`;
    }
    report += `Diámetro Hilo: ${inputs.diametro_hilo_mm} mm\n\n`;

    report += `--- RESULTADOS ---\n`;
    if (results.error) {
      report += `ESTADO: ERROR - ${results.error}\n`;
    } else {
      report += `Viabilidad: ${results.es_viable ? 'VIABLE' : 'NO VIABLE'}\n`;
      report += `Vueltas (N): ${results.vueltas}\n`;
      report += `Longitud Hilo (Total): ${results.longitud_hilo_m?.toFixed(2)} m\n`;
      report += `Resistencia DC: ${results.resistencia_ohm?.toFixed(2)} Ω\n`;
      report += `Paso de Bobinado: ${results.paso_sugerido_mm?.toFixed(2)} mm\n`;
      report += `Gap: ${results.gap_sugerido_mm?.toFixed(2)} mm\n`;
      report += `Inductancia Mutua: ${results.inductancia_mutua_nH?.toFixed(2)} nH\n`;
    }
    
    return report;
  };

  const handleExportTXT = () => {
    const text = generateTextReport();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `rogowski_report_${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rogowski-overlay">
      <div className="rogowski-container">

        {/* HEADER */}
        <header className="rogowski-header">
          <h2><span>🌀</span> Rogowski Coil Designer</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <button 
              className="toggle-btn" 
              onClick={handleExportTXT}
              style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }}
              title="Guardar diseño como reporte TXT"
            >
              📄 Exportar TXT
            </button>
            <button className="close-btn" onClick={onClose}>&times;</button>
          </div>
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

          <h3 className="panel-title" style={{ marginTop: '2rem' }}>Parámetros Eléctricos</h3>
          <div className="toggle-group main-toggle">
            <button
              className={`toggle-btn ${sensitivityMode === 'voltage_current' ? 'active' : ''}`}
              onClick={() => setSensitivityMode('voltage_current')}
            >Voltaje/Corriente</button>
            <button
              className={`toggle-btn ${sensitivityMode === 'sensitivity' ? 'active' : ''}`}
              onClick={() => setSensitivityMode('sensitivity')}
            >Sensibilidad Directa</button>
          </div>

          {sensitivityMode === 'voltage_current' ? (
            <>
              <div className="control-group">
                <label>Voltaje de Referencia (mV)</label>
                <input
                  className="rogowski-input"
                  type="number"
                  value={inputs.v_out_target_mv}
                  onChange={(e) => handleInputChange('v_out_target_mv', e.target.value)}
                />
              </div>

              <div className="control-group">
                <label>Corriente de Referencia (A)</label>
                <input
                  className="rogowski-input"
                  type="number"
                  value={inputs.i_rated}
                  onChange={(e) => handleInputChange('i_rated', e.target.value)}
                />
              </div>
            </>
          ) : (
            <div className="control-group">
              <label>Sensibilidad (mV/A)</label>
              <input
                className="rogowski-input"
                type="number"
                step="0.001"
                value={inputs.sensitivity_mv_a !== undefined ? inputs.sensitivity_mv_a : ''}
                onChange={(e) => handleInputChange('sensitivity_mv_a', e.target.value)}
              />
            </div>
          )}

          <div className="control-group">
            <label>Frecuencia (Hz)</label>
            <input
              className="rogowski-input"
              type="number"
              value={inputs.freq}
              onChange={(e) => handleInputChange('freq', e.target.value)}
            />
          </div>

          <h3 className="panel-title" style={{ marginTop: '2rem' }}>Geometría</h3>

          {/* Toggle Sección Transversal */}
          <div className="toggle-group main-toggle">
            <button
              className={`toggle-btn ${sectionType === 'rectangular' ? 'active' : ''}`}
              onClick={() => setSectionType('rectangular')}
            >▭ Rectangular</button>
            <button
              className={`toggle-btn ${sectionType === 'circular' ? 'active' : ''}`}
              onClick={() => setSectionType('circular')}
            >◯ Circular</button>
          </div>

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

          {sectionType === 'rectangular' ? (
            <>
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
            </>
          ) : (
            <div className="control-group">
              <label>Radio Sección (mm)</label>
              <input
                className="rogowski-input"
                type="number"
                step="0.1"
                value={inputs.radio_seccion_mm}
                onChange={(e) => handleInputChange('radio_seccion_mm', e.target.value)}
              />
            </div>
          )}

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
              <div className="result-value" style={{ fontSize: '1rem' }}>ERROR: {results.error}</div>
            </div>
          ) : (
            <>
              <div className={`result-card ${results.es_viable ? 'viable' : 'error'}`}>
                <div className="result-label">Vueltas Totales (N)</div>
                <div className="result-value">{results.vueltas}</div>
                {!results.es_viable && <div style={{ color: 'red', fontSize: '0.8rem', marginTop: 5 }}>No cabe en la capa interna</div>}
              </div>

              <div className="result-card info">
                <div className="result-label">Longitud Hilo (Total)</div>
                <div className="result-value">{results.longitud_hilo_m.toFixed(2)} <span className="result-unit">m</span></div>
              </div>

              <div className="result-card info">
                <div className="result-label">Resistencia DC</div>
                <div className="result-value">{results.resistencia_ohm.toFixed(2)} <span className="result-unit">Ω</span></div>
              </div>

              <h3 className="panel-title" style={{ marginTop: '2rem' }}>Parámetros de Bobinado</h3>

              <div className="result-card warning">
                <div className="result-label">Paso de Bobinado</div>
                <div className="result-value">{results.paso_sugerido_mm.toFixed(2)} <span className="result-unit">mm</span></div>
                <div className="result-label" style={{ marginTop: 5 }}>Gap: {results.gap_sugerido_mm.toFixed(2)} mm</div>
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
