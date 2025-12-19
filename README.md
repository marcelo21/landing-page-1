# FEMAS - Landing Page

Landing page creada con Vite + React para FEMAS Tecnología Industrial.

## Características

- **Diseño Responsivo**: Adaptable a dispositivos móviles, tablets y escritorio.
- **Tema Claro/Oscuro**: Soporte nativo para cambio de tema visual.
- **WeldMaster PRO**: Calculadora avanzada de parámetros de soldadura (Proyección y Puntos).
  - Acceso restringido mediante login.
  - Visualización interactiva de la soldadura.
  - Soporte para múltiples chapas (hasta 3) y cálculo de nuggets.

## Ejecutar localmente

```bash
npm install
npm run dev
```

## Estructura principal

- `index.html` - Punto de entrada
- `src/` - Código fuente
  - `components/` - Componentes React separados
    - `weld-calculator/` - Módulo de la calculadora WeldMaster PRO
  - `App.jsx` - Componente raíz
  - `App.css` - Estilos globales

## Git

Repositorio inicial local. Para enviar a un remoto (GitHub/GitLab):

```bash
git remote add origin <url-del-repositorio>
git push -u origin main
```

Contacto: correo@correo.com
