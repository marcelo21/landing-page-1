# Guía de Contribución

Estándares y convenciones para el desarrollo y mantenimiento del proyecto FEMAS Tecnología Industrial.

## Estándares de Código

### Componentes React

#### Nomenclatura
- **Componentes**: PascalCase (ej: `Navbar`, `CtaSection`, `ThemeToggle`)
- **Archivos**: Misma nomenclatura que el componente (ej: `Navbar.jsx`)
- **Variables/Funciones**: camelCase (ej: `toggleTheme`, `servicesList`, `savedTheme`)

#### Estructura Obligatoria
Todos los componentes deben incluir JSDoc al inicio:

```jsx
/**
 * NombreComponente
 * @description Breve descripción de qué hace el componente
 * @param {tipo} nombreProp - Descripción del prop (si aplica)
 * @returns {JSX.Element} Descripción del elemento retornado
 */
```

#### Ejemplo de Componente
```jsx
/**
 * ServiceCard
 * @description Tarjeta individual para mostrar un servicio
 * @param {string} icon - Ícono/emoji del servicio
 * @param {string} title - Título del servicio
 * @param {string} description - Descripción del servicio
 * @returns {JSX.Element} Tarjeta con contenido del servicio
 */
import React from 'react';

const ServiceCard = ({ icon, title, description }) => {
  return (
    <div className="card">
      <span className="card-icon">{icon}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default ServiceCard;
```

### CSS

#### Variables Custom Properties
- Prefijo: `--` (ej: `--primary-color`, `--bg-light`)
- Ubicación: Declaradas en `:root` y `[data-theme='dark']`
- Nombrado: kebab-case

#### Clases CSS
- Formato: kebab-case (ej: `.nav-links`, `.theme-toggle-btn`, `.card-icon`)
- Estructura: Agrupar por componente/sección

#### Orden de Propiedades
1. Display/Layout (display, flex, grid, etc.)
2. Box Model (width, height, padding, margin, etc.)
3. Colores y Background
4. Tipografía (font-size, color, text-align, etc.)
5. Transformaciones y Transiciones
6. Pseudo-elementos y Media Queries

#### Ejemplo de CSS Estructurado
```css
/* ============================================
   SECCIÓN: Navbar
   ============================================ */

.navbar {
  /* Layout */
  display: flex;
  position: sticky;
  top: 0;
  z-index: 1000;

  /* Box Model */
  width: 100%;
  padding: 1rem 0;

  /* Colores */
  background-color: var(--bg-surface);
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);

  /* Transiciones */
  transition: background-color 0.3s;
}

.nav-links a {
  /* Layout */
  display: inline-block;

  /* Box Model */
  margin-left: 20px;
  padding: 5px 0;

  /* Tipografía */
  text-decoration: none;
  color: var(--secondary-color);
  font-weight: 500;

  /* Transiciones */
  transition: color 0.3s;
}
```

### Comentarios

#### Comentarios de Función/Componente
```jsx
/**
 * Alterna entre tema claro y oscuro
 * @param {string} newTheme - El tema a aplicar ('light' o 'dark')
 * @returns {void}
 */
const applyTheme = (newTheme) => {
  // implementación
};
```

#### Comentarios en Línea
Usar para lógica no evidente:
```javascript
// Recuperar tema del almacenamiento local o usar por defecto
const savedTheme = localStorage.getItem('theme') || 'light';
```

#### Comentarios de Sección
```css
/* ============================================
   VARIABLES DE TEMA (CSS Custom Properties)
   ============================================ */
```

## Estructura del Proyecto

### Organización de Carpetas
- Los componentes simples se ubican directamente en `src/components/`.
- Los componentes complejos o módulos con múltiples archivos relacionados (como la calculadora) deben agruparse en una subcarpeta dentro de `src/components/` (ej: `src/components/weld-calculator/`).

```
landing-page-1/
├── public/
│   ├── background_1.jpg
│   ├── card_1.jpg
│   ├── card_2.jpg
│   └── *.svg (íconos)
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── Services.jsx
│   │   ├── Features.jsx
│   │   ├── CtaSection.jsx
│   │   ├── Footer.jsx
│   │   ├── ThemeToggle.jsx
│   │   └── README.md (este archivo)
│   ├── App.jsx
│   ├── App.css
│   └── main.jsx
├── CONTRIBUTING.md (este archivo)
├── package.json
├── vite.config.js
└── index.html
```

## Flujo de Trabajo

### Crear un Nuevo Componente

1. Crear archivo en `src/components/NombreComponente.jsx`
2. Agregar JSDoc con descripción clara
3. Implementar componente siguiendo convenciones
4. Crear estilos en `App.css` con nomenclatura consistente
5. Actualizar `src/components/README.md`

### Modificar Estilos

1. Localizar sección relevante en `App.css`
2. Mantener la estructura de variables CSS
3. Agregar comentarios si no es evidente
4. Probar en ambos temas (claro/oscuro)
5. Validar responsividad

### Agregar Funcionalidad

1. Seguir estándares de nomenclatura
2. Documentar con comentarios
3. Validar en múltiples navegadores
4. Probar con tema oscuro activado

## Checklist de Calidad

- [ ] Componente tiene JSDoc al inicio
- [ ] Nombres siguen convenciones (camelCase, PascalCase, kebab-case)
- [ ] Estilos usan variables CSS (no colores hardcodeados)
- [ ] Se proporciona soporte para tema oscuro
- [ ] Código es legible y mantenible
- [ ] No hay comentarios obsoletos
- [ ] Responsividad verificada (escritorio, tablet, móvil)
- [ ] Accesibilidad considerada (aria-labels, etc.)
- [ ] README actualizado si es necesario

## Temas y Colores

### Tema Claro (por defecto)
```css
--primary-color: #F58220 (Naranja corporativo)
--secondary-color: #555555 (Gris metálico)
--accent-color: #FFC107 (Amarillo/Dorado)
--bg-light: #f9f9f9
--bg-surface: #ffffff
--bg-body: #ffffff
--text-color: #333
```

### Tema Oscuro
```css
--primary-color: #F58220 (Se mantiene)
--secondary-color: #cccccc
--bg-light: #1a1a1a
--bg-surface: #242424
--bg-body: #121212
--text-color: #e0e0e0
```

## Recursos

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [JSDoc Reference](https://jsdoc.app/)
- [MDN CSS](https://developer.mozilla.org/en-US/docs/Web/CSS)

## Preguntas o Dudas

Para más información, revisar la documentación en `src/components/README.md`
