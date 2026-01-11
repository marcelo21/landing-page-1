import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Activity, AlertTriangle, CheckCircle, X, Zap, Gauge, Flame, Snowflake } from 'lucide-react';
import './HMIMicroSimulator.css';

/**
 * HMIMicroSimulator
 * @description Panel de control industrial simulado para demostración
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

  const [machineState, setMachineState] = useState(MACH_STATES.IDLE);
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [currentCycleTime, setCurrentCycleTime] = useState(0);
  const [kpiOk, setKpiOk] = useState(1240); // Empezar con un número realista
  const [lamps, setLamps] = useState({ clamp: false, weld: false, cool: false });
  
  // Referencias para timers
  const cycleIntervalRef = useRef(null);
  const resetTimeoutRef = useRef(null);

  // Efecto principal de la simulación
  useEffect(() => {
    if (machineState === MACH_STATES.WELDING) {
      const start = Date.now();
      setStartTime(start);
      setProgress(0);
      setLamps({ clamp: true, weld: false, cool: false });

      cycleIntervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - start;
        const totalDuration = 3000; // 3 segundos ciclo
        const percent = Math.min((elapsed / totalDuration) * 100, 100);
        
        // Actualizar KPI de tiempo real
        setCurrentCycleTime(elapsed);
        setProgress(percent);

        // Lógica de Lámparas Secuenciales
        if (percent < 20) {
           setLamps(prev => ({ ...prev, clamp: true }));
        } else if (percent >= 20 && percent < 70) {
           setLamps({ clamp: true, weld: true, cool: false });
        } else if (percent >= 70) {
           setLamps({ clamp: true, weld: false, cool: true });
        }

        // Fin del ciclo
        if (elapsed >= totalDuration) {
          finishCycle(totalDuration);
        }
      }, 50); // 20fps update
    }

    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, [machineState]);

  const finishCycle = (finalTime) => {
    clearInterval(cycleIntervalRef.current);
    setCurrentCycleTime(finalTime);
    setLamps({ clamp: false, weld: false, cool: false });

    // Determinar resultado (90% OK)
    const isOk = Math.random() > 0.1;
    
    if (isOk) {
      setMachineState(MACH_STATES.RESULT_OK);
      setKpiOk(prev => prev + 1);
    } else {
      setMachineState(MACH_STATES.RESULT_FAIL);
    }

    // Auto Reset luego de 2 segundos
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
    // Parada de emergencia simulada
    if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    setMachineState(MACH_STATES.IDLE);
    setLamps({ clamp: false, weld: false, cool: false });
    setProgress(0);
  };

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
      if (resetTimeoutRef.current) clearTimeout(resetTimeoutRef.current);
    };
  }, []);

  // Componentes UI Helpers
  const StatusLamp = ({ active, color, label, icon: Icon }) => (
    <div className="io-item">
      <div className={`status-lamp ${active ? 'active' : ''}`} 
           style={active ? { backgroundColor: color, boxShadow: `0 0 15px ${color}`, borderColor: '#fff' } : {}}
      >
        {active && Icon && <Icon size={14} color="#fff" style={{margin: '3px'}} />}
      </div>
      <span className="io-label">{label}</span>
    </div>
  );

  const KPICard = ({ title, value, unit, icon: Icon, color }) => (
    <div className="kpi-card" style={{ borderLeftColor: color }}>
      <div className="kpi-info">
        <span className="kpi-title">{title}</span>
        <div className="kpi-value">
          {value} <span style={{fontSize: '0.8rem', color: '#666'}}>{unit}</span>
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
            <Activity size={20} color="#007acc" />
            <span>HMI SIMULATOR <span style={{opacity: 0.5}}>v1.0</span></span>
          </div>
          
          <div className="hmi-status-indicator">
            <span style={{
              width: 8, height: 8, borderRadius: '50%', 
              background: machineState === 'IDLE' ? '#a0a0a0' : machineState === 'RESULT_FAIL' ? '#ff4d4d' : '#4dff4d'
            }}></span>
            {machineState}
          </div>

          <button className="hmi-close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </header>

        {/* Alerta de Error */}
        {machineState === MACH_STATES.RESULT_FAIL && (
          <div className="alarm-banner">
            <AlertTriangle size={24} />
            <span>FALLO DE PROCESO DETECTADO: PRESIÓN FUERA DE RANGO</span>
          </div>
        )}

        <div className="hmi-content">
          {/* Panel Izquierdo: Visualización y Controles */}
          <div className="left-column" style={{display: 'flex', flexDirection: 'column', gap: 20, overflow: 'hidden', height: '100%'}}>
            
            {/* Visualización de Proceso */}
            <div className="hmi-panel" style={{flex: 1, minHeight: 0}}>
              <div className="hmi-panel-title">Visualización de Proceso</div>
              
              <div className="hmi-visualization">
                <div className="gauge-container">
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 5, fontSize: '0.8rem', color: '#aaa'}}>
                    <span>Presión / Carga</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <div className="gauge-bar-bg">
                    <div className="gauge-bar-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>

                <div className="io-grid">
                  <StatusLamp active={lamps.clamp} color="#ff9f43" label="CLAMP" icon={Zap} />
                  <StatusLamp active={lamps.weld} color="#ff4d4d" label="WELD" icon={Flame} />
                  <StatusLamp active={lamps.cool} color="#00a8ff" label="COOL" icon={Snowflake} />
                </div>

                {machineState === MACH_STATES.RESULT_OK && (
                  <div style={{marginTop: 20, color: '#4dff4d', display: 'flex', alignItems: 'center', gap: 10,  fontWeight: 'bold', fontSize: '1.2rem', animation: 'fadeIn 0.2s'}}>
                    <CheckCircle size={28} />
                    CICLO OK
                  </div>
                )}
              </div>
            </div>

            {/* Panel de Control */}
            <div className="hmi-panel">
              <div className="hmi-panel-title">Panel de Operador</div>
              <div className="controls-grid">
                <button 
                  className="action-btn primary"
                  disabled={machineState !== MACH_STATES.IDLE}
                  onClick={handleStart}
                >
                  <Play size={24} />
                  INICIAR CICLO
                </button>
                
                <button 
                  className="action-btn"
                  disabled={machineState === MACH_STATES.IDLE}
                  onClick={handleStop}
                  style={{borderColor: '#ff4d4d', color: '#ff4d4d'}}
                >
                  <Square size={24} />
                  PARADA
                </button>
              </div>
            </div>

          </div>

          {/* Panel Derecho: KPIs */}
          <div className="right-column" style={{overflow: 'hidden', height: '100%'}}>
             <div className="hmi-panel" style={{height: '100%', display: 'flex', flexDirection: 'column'}}>
               <div className="hmi-panel-title">Métricas (KPI)</div>
               
               <div className="kpi-grid">
                 <KPICard 
                   title="Piezas OK" 
                   value={kpiOk} 
                   unit="uds" 
                   icon={CheckCircle} 
                   color="#4dff4d" 
                 />
                 
                 <KPICard 
                   title="Tiempo Ciclo" 
                   value={(currentCycleTime / 1000).toFixed(2)} 
                   unit="sec" 
                   icon={Activity} 
                   color="#00a8ff" 
                 />

                 <KPICard 
                   title="Eficiencia" 
                   value="92.4" 
                   unit="%" 
                   icon={Gauge} 
                   color="#ff9f43" 
                 />
               </div>

               <div style={{marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #333'}}>
                 <div className="hmi-panel-title" style={{border: 'none', marginBottom: 5}}>Estado de E/S</div>
                 <div style={{display: 'flex', flexDirection: 'column', gap: 6}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888'}}>
                        <span>Motor Principal</span>
                        <span style={{color: '#4dff4d'}}>ON</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888'}}>
                        <span>Presión Aire</span>
                        <span style={{color: '#4dff4d'}}>6.2 Bar</span>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#888'}}>
                        <span>Temp. Agua</span>
                        <span style={{color: '#00a8ff'}}>18°C</span>
                    </div>
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
