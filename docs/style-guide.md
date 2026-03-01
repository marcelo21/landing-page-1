# Guía de Estilos y Diseño (Style Guide)

## Temas y Paleta de Colores

El proyecto soporta de forma nativa dos temas principales: **Claro** (por defecto) y **Oscuro** (activado mediante `data-theme="dark"`).

Las variables CSS globales se definen en la pseudoclase `:root` en `src/App.css`.

### Colores Corporativos (Light Theme)
- **Primary Color:** `#F58220` (Naranja corporativo)
- **Secondary Color:** `#555555` (Gris metálico)
- **Accent Color:** `#FFC107` (Amarillo dorado)
- **Background Light:** `#f9f9f9`
- **Background Surface:** `#ffffff`
- **Background Body:** `#ffffff`
- **Text Color:** `#333`
- **White:** `#ffffff`

### Colores (Dark Theme)
- **Primary Color:** `#F58220` (Se mantiene para destacar acciones)
- **Secondary Color:** `#cccccc`
- **Background Light:** `#1a1a1a`
- **Background Surface:** `#242424`
- **Background Body:** `#121212`
- **Text Color:** `#e0e0e0`

## Tipografía
- Se utiliza la fuente por defecto del sistema (stack moderno): `'Segoe UI', Roboto, Helvetica, Arial, sans-serif`.
- Color del texto principal según tema (`var(--text-color)`).

## Clases Utilitarias (Globales)
Las utilidades siguientes están disponibles modularmente sin necesidad de importar CSS Modules, ya que se inyectan en `App.css`.

- `.container`: Limita el ancho máximo (`1200px`) y aplica márgenes laterales (`20px`).
- `.btn`: Estilos base para un botón interactivo (padding, radius, transition).
- `.btn-primary`: Botón principal destacado usando el Primary Color y texto blanco.

## Buenas Prácticas

1. **Variables sobre Hexadecimales**: Utiliza siempre las variables CSS (ej. `var(--primary-color)`) definidas en `App.css` en lugar de ingresar valores hexadecimales estáticos, para mantener la coherencia térmica de toda la App.
2. **Uso de Modulos**: Evitar clases CSS sueltas globales más allá de las utilitarias. Los específicos de cada vista/sección van en los `[Component].module.css`.
