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
    async function updateContent(path) {
        try {
            const response = await fetch(path);
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            document.querySelector('.docs-content').innerHTML = 
                newDoc.querySelector('.docs-content').innerHTML;
            document.title = newDoc.title;
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading page:', error);
            document.querySelector('.docs-content').innerHTML = `<h1>Error</h1><p>${error.message}</p>`;
        }
    }

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
