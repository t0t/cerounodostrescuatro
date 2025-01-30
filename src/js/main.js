import '../styles/styles.css'
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

// Función para obtener la ruta actual
function getCurrentPath() {
    return window.location.pathname;
}

// Función para cargar y renderizar el contenido
async function loadContent() {
    const path = getCurrentPath();
    const contentPath = contentMap[path] || contentMap['/'];
    const mainElement = document.querySelector('main.docs-content');
    
    if (!mainElement) {
        console.error('Main element not found');
        return;
    }
    
    try {
        // Cargar el contenido Markdown
        const response = await fetch(contentPath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const rawContent = await response.text();
        
        // Procesar el frontmatter y el contenido Markdown
        const { attributes: metadata, body } = frontMatter(rawContent);
        
        // Actualizar el hero
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.innerHTML = `
                <h1>${metadata.title}</h1>
                <p>${metadata.description}</p>
            `;
        }
        
        // Actualizar el contenido principal
        const mainContent = mainElement.querySelector('.main-content');
        if (mainContent) {
            mainContent.innerHTML = marked(body);
        } else {
            mainElement.innerHTML = `
                <div class="main-content">
                    ${marked(body)}
                </div>
            `;
        }
    } catch (error) {
        console.error('Error loading content:', error);
        mainElement.innerHTML = '<p>Error loading content</p>';
    }
}

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
    // Cargar contenido inicial
    loadContent();

    // Configurar el menú
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.docs-sidebar');
    const overlay = document.querySelector('.sidebar-overlay');

    if (menuToggle && sidebar && overlay) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
        });

        // Cerrar menú en pantallas grandes
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        });
    }

    // Manejar navegación
    document.addEventListener('click', (e) => {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            history.pushState(null, '', link.href);
            loadContent();
            
            // Cerrar el menú si está abierto
            if (sidebar && overlay && window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }
        }
    });
});

// Manejar navegación con los botones del navegador
window.addEventListener('popstate', loadContent);
