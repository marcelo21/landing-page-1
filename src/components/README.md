# Componentes

Documentación de todos los componentes React del proyecto FEMAS Tecnología Industrial.

## Estructura de Componentes

### Navbar.jsx
- **Descripción**: Barra de navegación principal con enlaces y toggle de tema
- **Ubicación**: `src/components/Navbar.jsx`
- **Props**: Ninguno
- **Dependencias**: ThemeToggle
- **Características**:
  - Logo FEMAS TI
  - Enlaces de navegación (Servicios, Nosotros, Contacto)
  - Botón de cambio de tema integrado

### Hero.jsx
- **Descripción**: Sección principal (hero) con mensaje de bienvenida y CTA
- **Ubicación**: `src/components/Hero.jsx`
- **Props**: Ninguno
- **Características**:
  - Imagen de fondo con overlay oscuro
  - Título principal
  - Descripción de servicios
  - Botón "Solicitar Cotización"

### Services.jsx
- **Descripción**: Grid de servicios principales de FEMAS
- **Ubicación**: `src/components/Services.jsx`
- **Props**: Ninguno
- **Características**:
  - 5 tarjetas de servicios (Soldadura, Automatización, Software, Ensayos, Hardware)
  - Iconos emoji representativos
  - Grid responsivo (auto-fit)
  - Efecto hover con elevación

### Features.jsx
- **Descripción**: Sección de características diferenciadoras
- **Ubicación**: `src/components/Features.jsx`
- **Props**: Ninguno
- **Características**:
  - Dos secciones alternadas (contenido + imagen)
  - Experiencia Automotriz
  - Soluciones Integrales
  - Imágenes locales (card_1.jpg, card_2.jpg)

### CtaSection.jsx
- **Descripción**: Sección de llamada a la acción para contacto
- **Ubicación**: `src/components/CtaSection.jsx`
- **Props**: Ninguno
- **Características**:
  - Fondo naranja corporativo
  - Botón de contacto directo por email
  - Mensaje persuasivo

### Footer.jsx
- **Descripción**: Pie de página con información de contacto
- **Ubicación**: `src/components/Footer.jsx`
- **Props**: Ninguno
- **Características**:
  - Nombre de la empresa
  - Ubicación (Córdoba, Argentina)
  - Email de contacto
  - Copyright dinámico (año actual)
  - Tema adaptativo (claro/oscuro)

### ThemeToggle.jsx
- **Descripción**: Botón para cambiar entre tema claro y oscuro
- **Ubicación**: `src/components/ThemeToggle.jsx`
- **Props**: Ninguno
- **Estado Local**:
  - `theme`: 'light' | 'dark'
- **Características**:
  - Persistencia en localStorage
  - Ícono dinámico (sol/luna)
  - Tooltips descriptivos
  - Accesibilidad (aria-label)

## Convenciones de Componentes

### Estructura General
```jsx
/**
 * NombreComponente
 * @description Breve descripción
 * @param {tipo} nombreProp - Descripción del prop
 * @returns {JSX.Element} Descripción del retorno
 */
import React from 'react';

const NombreComponente = ({ prop }) => {
  // Lógica del componente
  return (
    // JSX
  );
};

export default NombreComponente;
```

### Nombres
- Componentes: PascalCase (Navbar, Services, etc.)
- Variables/funciones: camelCase (toggleTheme, servicesList, etc.)
- Clases CSS: kebab-case (.theme-toggle-btn, .nav-links, etc.)

### Documentación
- Usar JSDoc para componentes y funciones complejas
- Comentarios en línea para lógica no evidente
- Type hints en comentarios para arrays/objetos complejos

## Ruta de Datos

```
App.jsx
├── Navbar.jsx
│   └── ThemeToggle.jsx
├── Hero.jsx
├── Services.jsx
├── Features.jsx
├── CtaSection.jsx
└── Footer.jsx
```

## Mejoras Futuras

- [ ] Extraer lista de servicios a un archivo de datos
- [ ] Componentizar tarjetas de servicios
- [ ] Agregar propiedades a componentes para mayor reutilización
- [ ] Crear componentes de utilidad (Button, Card, Container)
- [ ] Añadir tests unitarios
