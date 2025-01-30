import { marked } from 'marked';
import frontMatter from 'front-matter';

// Mapeo simple de rutas a archivos de contenido
const contentMap = {
    '/': './src/content/home.md',
    '/lab': './src/content/lab.md',
    '/fisionomia': './src/content/fisionomia.md',
    '/usos': './src/content/usos.md',
    '/about': './src/content/about.md',
    '/fuentes': './src/content/fuentes.md'
};

// Función para crear el hero usando los metadatos del frontmatter
function createHero(metadata) {
    return `
        <div class="hero">
            <div class="hero-content">
                <h1>${metadata.title}</h1>
                <p>${metadata.description}</p>
            </div>
        </div>
    `;
}

// Función para obtener la ruta actual
function getCurrentPath() {
    return window.location.pathname;
}

// Función para cargar y renderizar el contenido
async function loadContent() {
    const path = getCurrentPath();
    const contentPath = contentMap[path] || contentMap['/'];
    const mainElement = document.querySelector('main.docs-content');
    
    try {
        mainElement.innerHTML = '';
        
        // Cargar el contenido Markdown
        const response = await fetch(contentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawContent = await response.text();
        
        // Procesar el frontmatter y el contenido Markdown
        const { attributes: metadata, body } = frontMatter(rawContent);
        
        // Crear y añadir el hero usando los metadatos
        const heroHTML = createHero(metadata);
        mainElement.insertAdjacentHTML('afterbegin', heroHTML);
        
        // Convertir y añadir el contenido Markdown
        const contentHTML = marked(body);
        const contentDiv = document.createElement('div');
        contentDiv.className = 'content';
        contentDiv.innerHTML = contentHTML;
        mainElement.appendChild(contentDiv);
        
    } catch (error) {
        console.error('Error loading content:', error);
        mainElement.innerHTML = '<p>Error loading content</p>';
    }
}

// Manejar clics en los enlaces
document.addEventListener('click', (e) => {
    const link = e.target.closest('[data-link]');
    if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        window.history.pushState({}, '', href);
        loadContent();
    }
});

// Manejar navegación del navegador
window.addEventListener('popstate', loadContent);

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    loadContent();

    // Setup menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.docs-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    function toggleMenu() {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    }

    menuToggle.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Cerrar menú en pantallas grandes
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        }
    });
});
