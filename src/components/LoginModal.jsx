import React, { useState } from 'react';
import styles from './LoginModal.module.css';

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
    <div className={styles['login-overlay']}>
      <div className={styles['login-container']}>
        <button className={styles['close-login']} onClick={onClose}>&times;</button>

        <div className={styles['login-header']}>
          <div className={styles['login-app-icon']}>{appIcon}</div>
          <h2>Acceso Restringido</h2>
          <p>Ingrese sus credenciales para acceder a <strong>{appName}</strong></p>
        </div>

        <form className={styles['login-form']} onSubmit={handleSubmit}>
          <div className={styles['form-group']}>
            <label htmlFor="username">Usuario</label>
            <input
              type="text"
              id="username"
              className={styles['login-input']}
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              placeholder="Ingrese su usuario"
              autoFocus
            />
          </div>

          <div className={styles['form-group']}>
            <label htmlFor="password">Contraseña</label>
            <div className={styles['input-wrapper']}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className={styles['login-input']}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="Ingrese su contraseña"
              />
              <button
                type="button"
                className={styles['toggle-password']}
                onClick={() => setShowPassword(!showPassword)}
                title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {error && <div className={styles['error-message']}>{error}</div>}

          <button type="submit" className={styles['login-btn']}>
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
