import fs from 'fs';
import path from 'path';
import { marked } from 'marked';
import frontMatter from 'front-matter';

// Permitir HTML en el markdown
marked.setOptions({
    headerIds: false,
    mangle: false,
    breaks: true,
    gfm: true,
    xhtml: true
});

// Template HTML base
function template(content, title, description) {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="icon" type="image/x-icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="/styles.css">
</head>
<body>
    <div class="layout-container">
        <button class="menu-toggle" aria-label="Toggle menu">☰</button>
        <div class="sidebar-overlay"></div>
        
        <aside class="docs-sidebar">
            <nav class="nav-tree">
                <ul>
                    <li><a href="/" data-link>Inicio</a></li>
                    <li><a href="/about" data-link>Sobre el Modelo</a></li>
                    <li><a href="/faqs" data-link>Preguntas Frecuentes</a></li>
                    <li><a href="/fisionomia" data-link>Fisionomía</a></li>
                    <li><a href="/fuentes" data-link>Fuentes</a></li>
                    <li><a href="/lab" data-link>Laboratorio</a></li>
                    <li><a href="/usos" data-link>Usos</a></li>
                </ul>
            </nav>
        </aside>

        <main class="docs-content">
            <div class="hero">
                <div class="hero-content">
                    <h1>${title}</h1>
                    <p>${description}</p>
                </div>
            </div>
            <div class="main-content">
                ${content}
            </div>
        </main>

        <footer class="footer">
            Sergio Forés
        </footer>
    </div>

    <script type="module" src="/src/js/main.js"></script>
</body>
</html>`;
}

// Crear directorio dist si no existe
if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
}

// Procesar archivos markdown
const contentDir = 'src/content';
const files = fs.readdirSync(contentDir);

files.forEach(file => {
    if (path.extname(file) === '.md') {
        const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const { attributes, body } = frontMatter(content);
        const htmlContent = marked.parse(body);
        
        // Crear archivo HTML
        const htmlFileName = file.replace('.md', '.html');
        const htmlPath = path.join('dist', htmlFileName);
        
        fs.writeFileSync(htmlPath, template(htmlContent, attributes.title, attributes.description));
    }
});

// Copiar archivos estáticos
fs.copyFileSync('src/styles/styles.css', 'dist/styles.css');
fs.copyFileSync('favicon.ico', 'dist/favicon.ico');

// Crear index.html
const homeContent = fs.readFileSync(path.join(contentDir, 'home.md'), 'utf8');
const { attributes: homeAttributes, body: homeBody } = frontMatter(homeContent);
const homeHtml = marked.parse(homeBody);
fs.writeFileSync('dist/index.html', template(homeHtml, homeAttributes.title, homeAttributes.description));
