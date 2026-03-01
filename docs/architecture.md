# Arquitectura del Proyecto

## Stack Tecnológico

- **Framework**: React 18+
- **Bundler**: Vite
- **Estilos**: Vanilla CSS y CSS Modules
- **Iconografía**: Lucide React

## Estructura de Directorios

- `src/`: Código fuente de la aplicación.
  - `components/`: Componentes UI reutilizables e interactivos (ej. `Navbar`, `Hero`, `Services`).
    - `weld-calculator/`: Submódulo específico para la calculadora de soldadura.
    - `rogowski-calculator/`: Submódulo para cálculos de Rogowski.
    - `hmi-simulator/`: Submódulo para simulación HMI.
  - `App.jsx`: Componente raíz principal.
  - `App.css`: Estilos globales, variables CSS, tokens de diseño y reglas base.
  - `main.jsx`: Punto de entrada de la aplicación en React.
- `docs/`: Documentación técnica del proyecto.
- `public/`: Recursos públicos estáticos (imágenes, logos, etc.).

## CSS Modules

Para mantener el aislamiento de estilos y una alta mantenibilidad, el proyecto utiliza **CSS Modules**.

- **Estilos Globales**: Se definen exclusivamente en `src/App.css`. Aquí residen las variables de color (light/dark mode), tipografías, resets de márgenes y clases utilitarias genéricas de toda la app (`.container`, `.btn`).
- **Estilos de Componentes**: Cada componente tiene su propio archivo `.module.css` asociado (ej. `Navbar.module.css`). Dentro del componente React, las clases se importan como un objeto module y se acceden en los elementos usando sus propiedades (`className={styles.navbar}`).
