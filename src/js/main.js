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
    function updateActiveMenuItem(path) {
        // Remover la clase active de todos los enlaces
        document.querySelectorAll('.nav-tree a').forEach(link => {
            link.classList.remove('active');
        });

        // Encontrar y activar el enlace correspondiente a la ruta actual
        const currentLink = document.querySelector(`.nav-tree a[href="${path}"]`);
        if (currentLink) {
            currentLink.classList.add('active');
        } else if (path === '/cerounodostrescuatro/' || path === '/cerounodostrescuatro') {
            // Activar el enlace de inicio
            document.querySelector('.nav-tree a[href="./"]')?.classList.add('active');
        }
    }

    async function updateContent(path) {
        try {
            const response = await fetch(path);
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            document.querySelector('.docs-content').innerHTML = 
                newDoc.querySelector('.docs-content').innerHTML;
            document.title = newDoc.title;
            
            // Actualizar el elemento activo del menú
            updateActiveMenuItem(path);
            
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading page:', error);
            document.querySelector('.docs-content').innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
        }
    }

    // Establecer el elemento activo inicial
    updateActiveMenuItem(window.location.pathname);

    document.addEventListener('click', async (e) => {
        const link = e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            const path = link.getAttribute('href');
            history.pushState(null, '', path);
            await updateContent(path);
        }
    });

    window.addEventListener('popstate', async () => {
        await updateContent(window.location.pathname);
    });
});
