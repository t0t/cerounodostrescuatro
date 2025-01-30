// Router configuration
const routes = {
    '/': { title: 'Home', contentFile: '/src/content/home.md', showHero: true },
    '/about': { title: 'About', contentFile: '/src/content/about.md', showHero: false },
    '/faqs': { title: 'FAQs', contentFile: '/src/content/faqs.md', showHero: false },
    '/fisionomia': { title: 'Fisionomía', contentFile: '/src/content/fisionomia.md', showHero: false },
    '/fuentes': { title: 'Fuentes', contentFile: '/src/content/fuentes.md', showHero: false },
    '/lab': { title: 'Lab', contentFile: '/src/content/lab.md', showHero: false },
    '/usos': { title: 'Usos', contentFile: '/src/content/usos.md', showHero: false }
};

// Markdown parser configuration
const markdownIt = window.markdownit({
    html: true,  // Enable HTML tags in source
    breaks: true,  // Convert '\n' in paragraphs into <br>
    linkify: true  // Autoconvert URL-like text to links
});

// Router handler
const handleRoute = async () => {
    const path = window.location.pathname;
    const route = routes[path] || routes['/'];
    
    try {
        const response = await fetch(route.contentFile);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const markdown = await response.text();
        const html = markdownIt.render(markdown);
        
        document.title = `${route.title} - CeroUnoDosTresCuatro`;
        document.getElementById('content').innerHTML = html;
        
        // Show/hide hero based on route
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.display = route.showHero ? 'block' : 'none';
        }
        
        // Update active nav link
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === path) {
                link.classList.add('active');
            }
        });
    } catch (error) {
        console.error('Error loading content:', error);
        document.getElementById('content').innerHTML = '<h1>Error loading content</h1><p>Lo sentimos, no se pudo cargar el contenido.</p>';
    }
};

// Initialize router
window.addEventListener('popstate', handleRoute);
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('click', (e) => {
        if (e.target.matches('nav a')) {
            e.preventDefault();
            const href = e.target.getAttribute('href');
            window.history.pushState({}, '', href);
            handleRoute();
        }
    });
    handleRoute();
});
