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
            if (!response.ok) throw new Error('No se pudo cargar la página');
            
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            const content = newDoc.querySelector('.docs-content');
            if (!content) throw new Error('No se encontró el contenido');
            
            document.querySelector('.docs-content').innerHTML = content.innerHTML;
            document.title = newDoc.title;
            
            // Actualizar el elemento activo del menú
            updateActiveMenuItem(path);
            
            window.scrollTo(0, 0);
        } catch (error) {
            console.error('Error loading page:', error);
            document.querySelector('.docs-content').innerHTML = `
                <h1>Error</h1>
                <p>${error.message}</p>
            `;
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

    // Función para buscar en el contenido
    async function searchContent(query) {
        const links = Array.from(document.querySelectorAll('.nav-tree a[data-link]'));
        const results = [];

        for (const link of links) {
            try {
                const url = link.getAttribute('href');
                const response = await fetch(url);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const content = doc.querySelector('.docs-content').textContent.toLowerCase();
                const title = doc.title;

                if (content.includes(query.toLowerCase())) {
                    // Encontrar el contexto alrededor de la coincidencia
                    const index = content.indexOf(query.toLowerCase());
                    const start = Math.max(0, index - 50);
                    const end = Math.min(content.length, index + query.length + 50);
                    const preview = content.slice(start, end).replace(/\s+/g, ' ').trim();

                    results.push({
                        title,
                        preview: '...' + preview + '...',
                        url
                    });
                }
            } catch (error) {
                console.error('Error searching in:', link.href, error);
            }
        }

        return results;
    }

    // Función para mostrar los resultados
    function displaySearchResults(results) {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = '';
        resultsContainer.hidden = results.length === 0;

        results.forEach(result => {
            const resultElement = document.createElement('div');
            resultElement.className = 'search-result-item';
            resultElement.innerHTML = `
                <div class="title">${result.title}</div>
                <div class="preview">${result.preview}</div>
            `;
            resultElement.addEventListener('click', async () => {
                const path = result.url;
                history.pushState(null, '', path);
                await updateContent(path);
                resultsContainer.hidden = true;
                document.getElementById('search-input').value = '';
                // Actualizar el menú activo
                updateActiveMenuItem(path);
            });
            resultsContainer.appendChild(resultElement);
        });
    }

    // Configurar el buscador
    let searchTimeout;
    const searchInput = document.getElementById('search-input');
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.trim();
        
        if (query.length < 3) {
            document.getElementById('search-results').hidden = true;
            return;
        }

        searchTimeout = setTimeout(async () => {
            const results = await searchContent(query);
            displaySearchResults(results);
        }, 300);
    });

    // Cerrar resultados al hacer clic fuera
    document.addEventListener('click', (e) => {
        const searchContainer = document.querySelector('.search-container');
        const resultsContainer = document.getElementById('search-results');
        
        if (!searchContainer.contains(e.target)) {
            resultsContainer.hidden = true;
        }
    });
});
