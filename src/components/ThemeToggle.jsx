import React, { useState, useEffect } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <button 
      onClick={toggleTheme} 
      className="theme-toggle-btn"
      aria-label="Cambiar tema"
      title={theme === 'light' ? 'Activar modo oscuro' : 'Activar modo claro'}
    >
      <img 
        src={theme === 'light' ? '/moon-svgrepo-com.svg' : '/sun-svgrepo-com.svg'} 
        alt={theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'} 
        width="24" 
        height="24" 
      />
    </button>
  );
};

export default ThemeToggle;
