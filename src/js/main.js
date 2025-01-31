import '../styles/styles.css';

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', () => {
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
    document.addEventListener('click', async (e) => {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            const path = link.getAttribute('href');
            const baseUrl = import.meta.env.BASE_URL || '/';
            
            // Construir la ruta completa
            const fullPath = path === './' ? baseUrl : `${baseUrl}${path.replace('./', '')}`;
            history.pushState(null, '', fullPath);
            
            // Cerrar el menú si está abierto
            if (sidebar && overlay && window.innerWidth <= 768) {
                sidebar.classList.remove('active');
                overlay.classList.remove('active');
            }

            // Cargar el contenido de la página
            try {
                const response = await fetch(`${fullPath}/index.html`);
                if (!response.ok) throw new Error('Page not found');
                const html = await response.text();
                
                // Actualizar el contenido
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('.docs-content');
                if (content) {
                    document.querySelector('.docs-content').innerHTML = content.innerHTML;
                }
                
                // Actualizar el título si existe
                const title = doc.querySelector('title');
                if (title) {
                    document.title = title.textContent;
                }
            } catch (error) {
                console.error('Error loading page:', error);
            }
        }
    });
});
