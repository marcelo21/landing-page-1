import React, { useState } from 'react';
import './LoginModal.css';

/**
 * LoginModal
 * @description Modal de autenticación para acceder a funciones premium (WeldMaster PRO)
 * @param {function} onLogin - Función a ejecutar tras un login exitoso
 * @param {function} onClose - Función para cerrar el modal
 * @param {string} appName - Nombre de la aplicación a la que se intenta acceder
 * @param {string} appIcon - Icono de la aplicación
 * @returns {JSX.Element} Modal con formulario de usuario y contraseña
 */
const LoginModal = ({ onLogin, onClose, appName = 'WeldMaster PRO', appIcon = '🔐' }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === 'FEMAS' && password === 'FEMAS') {
      onLogin();
    } else {
      setError('Usuario o contraseña incorrectos');
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-container">
        <button className="close-login" onClick={onClose}>&times;</button>
        
        <div className="login-header">
          <div className="login-app-icon">{appIcon}</div>
          <h2>Acceso Restringido</h2>
          <p>Ingrese sus credenciales para acceder a <strong>{appName}</strong></p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              className="login-input"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Ingrese su usuario"
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div className="input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="login-input"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Ingrese su contraseña"
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-btn">
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
