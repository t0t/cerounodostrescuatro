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

// Procesar archivos markdown
const contentDir = 'src/content';
const files = fs.readdirSync(contentDir);

files.forEach(file => {
    if (path.extname(file) === '.md') {
        const content = fs.readFileSync(path.join(contentDir, file), 'utf8');
        const { attributes, body } = frontMatter(content);
        const htmlContent = marked.parse(body);
        
        // Crear archivo HTML en la raíz
        const htmlFileName = file.replace('.md', '.html');
        fs.writeFileSync(htmlFileName, template(htmlContent, attributes.title, attributes.description));
    }
});

// Copiar archivos estáticos desde .temp_build
if (fs.existsSync('.temp_build')) {
    const tempFiles = fs.readdirSync('.temp_build');
    tempFiles.forEach(file => {
        if (file.endsWith('.js') || file.endsWith('.css') || file.endsWith('.ico')) {
            fs.copyFileSync(path.join('.temp_build', file), file);
        }
    });
}

// Crear index.html
const homeContent = fs.readFileSync(path.join(contentDir, 'home.md'), 'utf8');
const { attributes: homeAttributes, body: homeBody } = frontMatter(homeContent);
const homeHtml = marked.parse(homeBody);
fs.writeFileSync('index.html', template(homeHtml, homeAttributes.title, homeAttributes.description));
