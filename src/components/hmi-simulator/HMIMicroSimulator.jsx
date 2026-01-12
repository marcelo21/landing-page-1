import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, AlertTriangle, CheckCircle, X, Zap, Gauge, Flame, Snowflake, Settings, Terminal, Database } from 'lucide-react';
import './HMIMicroSimulator.css';

/**
 * HMIMicroSimulator
 * @description Panel de control industrial simulado para demostración con telemetría interactiva
 * @param {function} onClose - Función para cerrar el simulador
 */
const HMIMicroSimulator = ({ onClose }) => {
  // Estados de la Máquina Finitas
  const MACH_STATES = {
    IDLE: 'IDLE',
    WELDING: 'WELDING',
    RESULT_OK: 'RESULT_OK',
    RESULT_FAIL: 'RESULT_FAIL'
  };

  // Persistencia y Parámetros
  const [machineState, setMachineState] = useState(MACH_STATES.IDLE);
  const [showSettings, setShowSettings] = useState(false);
  const [kpiOk, setKpiOk] = useState(() => {
    const saved = localStorage.getItem('hmi_piezas_ok');
    return saved ? parseInt(saved) : 1240;
  });

  const [settings, setSettings] = useState({
    cycleTime: 3000,
    pressureSetpoint: 6.2,
    failureProb: 0.1
  });

  // Telemetría y Logs
  const [progress, setProgress] = useState(0);
  const [currentCycleTime, setCurrentCycleTime] = useState(0);
  const [lamps, setLamps] = useState({ clamp: false, weld: false, cool: false });
  const [logs, setLogs] = useState([{ time: new Date().toLocaleTimeString(), msg: 'SISTEMA INICIALIZADO - READY' }]);
  const [sensors, setSensors] = useState({ temp: 18.0, pressure: 6.2 });
  
  // Referencias
  const cycleIntervalRef = useRef(null);
  const resetTimeoutRef = useRef(null);
  const logEndRef = useRef(null);

  // Auto-scroll del log
  useEffect(() => {
    if (logEndRef.current) {
        logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Simulación de "Ruido" en Sensores
  useEffect(() => {
    const sensorInterval = setInterval(() => {
      setSensors(prev => ({
        temp: +(prev.temp + (Math.random() * 0.4 - 0.2)).toFixed(1),
        pressure: +(settings.pressureSetpoint + (Math.random() * 0.2 - 0.1)).toFixed(2)
      }));
    }, 1000);
    return () => clearInterval(sensorInterval);
  }, [settings.pressureSetpoint]);

  // Persistencia
  useEffect(() => {
    localStorage.setItem('hmi_piezas_ok', kpiOk.toString());
  }, [kpiOk]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, { time: new Date().toLocaleTimeString(), msg: msg.toUpperCase() }].slice(-10));
  };

  // Efecto principal de la simulación
  useEffect(() => {
    if (machineState === MACH_STATES.WELDING) {
      const start = Date.now();
      addLog('Iniciando ciclo de producción');
      setProgress(0);
      setLamps({ clamp: true, weld: false, cool: false });

      cycleIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const totalDuration = settings.cycleTime;
        const percent = Math.min((elapsed / totalDuration) * 100, 100);
        
        setCurrentCycleTime(elapsed);
        setProgress(percent);

        // Lógica de Lámparas Secuenciales
        if (percent >= 20 && percent < 70 && !lamps.weld) {
           setLamps({ clamp: true, weld: true, cool: false });
        } else if (percent >= 70 && lamps.weld) {
           setLamps({ clamp: true, weld: false, cool: true });
        }

        if (percent === 20) addLog('Cierre de mordazas (Clamping)');
        if (percent === 70) addLog('Fase de enfriamiento');

        if (elapsed >= totalDuration) {
          finishCycle(totalDuration);
        }
      }, 50);
    }

    return () => clearInterval(cycleIntervalRef.current);
  }, [machineState]);

  const finishCycle = (finalTime) => {
    clearInterval(cycleIntervalRef.current);
    setCurrentCycleTime(finalTime);
    setLamps({ clamp: false, weld: false, cool: false });

    // Probabilidad de falla dinámica
    const currentFailProb = settings.pressureSetpoint < 5 ? 0.4 : settings.failureProb;
    const isOk = Math.random() > currentFailProb;
    
    if (isOk) {
      addLog('Ciclo finalizado: PIEZA OK');
      setMachineState(MACH_STATES.RESULT_OK);
      setKpiOk(prev => prev + 1);
    } else {
      addLog('ALARMA: Fallo de calidad detectada');
      setMachineState(MACH_STATES.RESULT_FAIL);
    }

    resetTimeoutRef.current = setTimeout(() => {
      setMachineState(MACH_STATES.IDLE);
      setProgress(0);
      setCurrentCycleTime(0);
    }, 2000);
  };

  const handleStart = () => {
    if (machineState === MACH_STATES.IDLE) {
      setMachineState(MACH_STATES.WELDING);
    }
  };

  const handleStop = () => {
    addLog('PARADA DE EMERGENCIA ACTIVADA');
    clearInterval(cycleIntervalRef.current);
    clearTimeout(resetTimeoutRef.current);
    setMachineState(MACH_STATES.IDLE);
    setLamps({ clamp: false, weld: false, cool: false });
    setProgress(0);
  };

  // Componentes UI Helpers
  const StatusLamp = ({ active, label, icon: Icon, colorClass }) => (
    <div className="io-item">
      <div className={`status-lamp ${active ? colorClass : ''}`}>
        {active && Icon && <Icon size={14} color="#fff" />}
      </div>
      <span className="io-label">{label}</span>
    </div>
  );

  const KPICard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="kpi-card" style={{ borderLeftColor: color }}>
      <div className="kpi-info">
        <span className="kpi-title">{title}</span>
        <div className="kpi-value">
          {value} <span className="kpi-unit">{unit}</span>
        </div>
      </div>
      <Icon size={24} color={color} />
    </div>
  );

  return (
    <div className="hmi-overlay">
      <div className="hmi-container">
        
        {/* Header */}
        <header className="hmi-header">
          <div className="hmi-title">
            <Activity size={20} color="var(--primary-color)" />
            <span>HMI SIMULATOR <span style={{opacity: 0.5}}>v2.0</span></span>
          </div>
          
          <div className="hmi-actions">
            <div className="hmi-status-indicator">
              <span className={`status-dot ${machineState}`}></span>
              {machineState}
            </div>
            <button className="hmi-icon-btn" onClick={() => setShowSettings(!showSettings)} title="Configuración">
              <Settings size={20} />
            </button>
            <button className="hmi-icon-btn" onClick={onClose} title="Cerrar">
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Settings Overlay */}
        {showSettings && (
          <div className="settings-panel">
            <div className="settings-header">
              <h3>CONFIGURACIÓN DE PROCESO</h3>
              <button className="hmi-close-btn" onClick={() => setShowSettings(false)}><X size={18} /></button>
            </div>
            <div className="settings-body">
              <div className="setting-item">
                <label>Tiempo de Ciclo (ms)</label>
                <div className="input-with-value">
                    <input 
                    type="range" min="1000" max="6000" step="500" 
                    value={settings.cycleTime} 
                    onChange={(e) => setSettings({...settings, cycleTime: parseInt(e.target.value)})}
                    />
                    <span className="setting-value">{settings.cycleTime}ms</span>
                </div>
              </div>
              <div className="setting-item">
                <label>Presión Nominal (Bar)</label>
                <div className="input-with-value">
                    <input 
                    type="range" min="4" max="8" step="0.1" 
                    value={settings.pressureSetpoint} 
                    onChange={(e) => setSettings({...settings, pressureSetpoint: parseFloat(e.target.value)})}
                    />
                    <span className="setting-value">{settings.pressureSetpoint} Bar</span>
                </div>
                {settings.pressureSetpoint < 5 && <span className="setting-warning">Aviso: Riesgo de fallo aumentado</span>}
              </div>
            </div>
          </div>
        )}

        {/* Alerta de Error */}
        {machineState === MACH_STATES.RESULT_FAIL && (
          <div className="alarm-banner">
            <AlertTriangle size={24} />
            <span>FALLO DE PROCESO DETECTADO: PRESIÓN FUERA DE RANGO</span>
          </div>
        )}

        <div className="hmi-content">
          {/* Panel Izquierdo */}
          <div className="left-column hmi-column">
            
            <div className="hmi-panel visualization-panel">
              <div className="hmi-panel-title">Visualización de Proceso</div>
              
              <div className="hmi-visualization">
                 <div className="visualizer-main">
                    <div className="gauge-container">
                      <div className="gauge-header">
                        <span>Prensa Hidráulica / Presión</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <div className="gauge-bar-bg">
                        <div className="gauge-bar-fill" style={{ width: `${progress}%` }}></div>
                      </div>
                    </div>

                    <div className="io-grid">
                      <StatusLamp active={lamps.clamp} label="CLAMP" icon={Zap} colorClass="warning" />
                      <StatusLamp active={lamps.weld} label="WELD" icon={Flame} colorClass="danger" />
                      <StatusLamp active={lamps.cool} label="COOL" icon={Snowflake} colorClass="info" />
                    </div>
                </div>

                {machineState === MACH_STATES.RESULT_OK && (
                  <div className="result-ok-msg">
                    <CheckCircle size={28} /> CICLO OK
                  </div>
                )}
              </div>
            </div>

            <div className="hmi-panel terminal-panel">
              <div className="hmi-panel-title">
                <Terminal size={14} style={{marginRight: 8}} /> LIVE EVENT LOG
              </div>
              <div className="terminal-body">
                {logs.map((log, i) => (
                  <div key={i} className="log-entry">
                    <span className="log-time">[{log.time}]</span>
                    <span className="log-msg">{log.msg}</span>
                  </div>
                ))}
                <div ref={logEndRef} />
              </div>
            </div>
          </div>

          {/* Panel Derecho */}
          <div className="right-column hmi-column">
             <div className="hmi-panel kpi-panel">
               <div className="hmi-panel-title">Métricas de Producción</div>
               
               <div className="kpi-panel-content">
                 <div className="kpi-grid">
                   <KPICard title="Piezas OK" value={kpiOk} unit="uds" icon={CheckCircle} color="#4dff4d" />
                   <KPICard title="T. Ciclo" value={(currentCycleTime / 1000).toFixed(2)} unit="sec" icon={Activity} color="#00a8ff" />
                   <KPICard title="OEE" value="94.2" unit="%" icon={Gauge} color="#ff9f43" />
                 </div>

                 <div className="ios-status-section">
                   <div className="hmi-panel-title no-border" style={{paddingLeft: 0, paddingRight: 0}}>Telemetría de Red</div>
                   <div className="ios-list">
                      <div className="io-status-item">
                          <span>Presión Real</span>
                          <span className={sensors.pressure < 5 ? 'status-err' : 'status-on'}>{sensors.pressure} Bar</span>
                      </div>
                      <div className="io-status-item">
                          <span>Temp. Fluido</span>
                          <span className="status-info-text">{sensors.temp} °C</span>
                      </div>
                      <div className="io-status-item">
                          <span>Cumplimiento</span>
                          <span className="status-text">{Math.round((kpiOk/2000)*100)}%</span>
                      </div>
                   </div>
                 </div>

                 <div className="manual-controls">
                    <button 
                      className="action-btn primary"
                      disabled={machineState !== MACH_STATES.IDLE}
                      onClick={handleStart}
                    >
                      <Play size={20} /> START CYCLE
                    </button>
                    <button 
                      className="action-btn stop-btn"
                      disabled={machineState === MACH_STATES.IDLE}
                      onClick={handleStop}
                    >
                      <Square size={20} /> STOP
                    </button>
                 </div>
               </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HMIMicroSimulator;

