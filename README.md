# Modelo 0,1,2,3,4

Un sistema de documentación estático construido con Vite que genera páginas HTML a partir de archivos Markdown.

## Características

- Contenido en Markdown con frontmatter para metadatos
- Diseño responsive con CSS Grid
- Menú lateral adaptable para móvil y desktop
- Build optimizado con Vite
- Hot reload durante desarrollo
- Deploy automático a GitHub Pages

## Instalación

```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/cerounodostrescuatro.git

# Instalar dependencias
cd cerounodostrescuatro
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

## Estructura del Proyecto

```
cerounodostrescuatro/
├── src/
│   ├── content/      # Archivos Markdown
│   ├── js/          # JavaScript
│   └── styles/      # CSS
├── index.html       # Plantilla HTML principal
├── vite.config.js   # Configuración de Vite
└── package.json     # Dependencias y scripts
```

## Desarrollo

1. Los archivos Markdown en `src/content/` se convierten automáticamente en páginas HTML
2. El frontmatter de cada archivo Markdown define el título y descripción de la página
3. Los cambios en archivos se detectan automáticamente y actualizan el navegador

## Deploy

El proyecto se despliega automáticamente a GitHub Pages cuando se hace push a la rama main.

## Licencia

MIT
