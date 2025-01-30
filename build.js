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

// Leer el template HTML
const templateContent = fs.readFileSync('template.html', 'utf8');

// Template HTML base
function template(content, title, description) {
    let html = templateContent;
    
    // Reemplazar el título
    html = html.replace('<title>Modelo 0,1,2,3,4</title>', `<title>${title}</title>`);
    
    // Reemplazar el contenido del hero
    html = html.replace('<!-- El contenido del hero se insertará aquí -->', `<h1>${title}</h1><p>${description}</p>`);
    
    // Reemplazar el contenido principal
    html = html.replace('<!-- El contenido se cargará aquí -->', content);
    
    return html;
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
