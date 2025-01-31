import { defineConfig } from 'vite';
import { plugin as markdown } from 'vite-plugin-markdown';
import fs from 'fs';
import { marked } from 'marked';
import frontMatter from 'front-matter';
import { exec } from 'child_process';
import { promisify } from 'util';
import { resolve } from 'path';

const execAsync = promisify(exec);

// Configurar marked para permitir HTML
marked.setOptions({
    headerIds: false,
    mangle: false,
    html: true
});

// Plugin personalizado para generar HTML en desarrollo
function devHtmlPlugin() {
    const pages = {
        'index': './src/content/home.md',
        'lab': './src/content/lab.md',
        'fisionomia': './src/content/fisionomia.md',
        'usos': './src/content/usos.md',
        'about': './src/content/about.md',
        'fuentes': './src/content/fuentes.md'
    };

    return {
        name: 'dev-html',
        configureServer(server) {
            server.middlewares.use(async (req, res, next) => {
                const url = req.url === '/' ? '/index' : req.url;
                const page = url.split('.')[0].substring(1);

                if (pages[page]) {
                    try {
                        const markdown = fs.readFileSync(pages[page], 'utf-8');
                        const { attributes, body } = frontMatter(markdown);
                        const htmlContent = marked.parse(body);

                        const html = `<!DOCTYPE html>
                        <html lang="es">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>${attributes.title} - Modelo 0,1,2,3,4</title>
                            <link rel="icon" type="image/x-icon" href="favicon.ico">
                            <link rel="preconnect" href="https://fonts.googleapis.com">
                            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                            <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap" rel="stylesheet">
                            <script type="module" src="/src/js/main.js"></script>
                            <link rel="stylesheet" href="/src/styles/styles.css">
                        </head>
                        <body>
                            <div class="layout-container">
                                <button class="menu-toggle" aria-label="Toggle menu">☰</button>
                                <div class="sidebar-overlay"></div>
                                
                                <aside class="docs-sidebar">
                                    <nav class="nav-tree">
                                        <ul>
                                            <li><a href="/" data-link>Inicio</a></li>
                                            <li><a href="/lab" data-link>Laboratorio</a></li>
                                            <li><a href="/fisionomia" data-link>Fisionomía</a></li>
                                            <li><a href="/usos" data-link>Casos de Uso</a></li>
                                            <li><a href="/about" data-link>About</a></li>
                                            <li><a href="/fuentes" data-link>Fuentes</a></li>
                                        </ul>
                                    </nav>
                                </aside>

                                <main class="docs-content">
                                    <div class="hero">
                                        <div class="hero-content">
                                            <h1>${attributes.title}</h1>
                                            <p>${attributes.description}</p>
                                        </div>
                                    </div>
                                    <div class="container">
                                        <div class="main-content">
                                            ${htmlContent}
                                        </div>
                                    </div>
                                </main>

                                <footer>
                                    <div> 2024 Sergio Forés</div>
                                    <div>
                                        <a href="https://github.com/t0t/cerounodostrescuatro" target="_blank">GitHub</a>
                                    </div>
                                </footer>
                            </div>

                            <script>
                                document.addEventListener('DOMContentLoaded', () => {
                                    const menuToggle = document.querySelector('.menu-toggle');
                                    const sidebar = document.querySelector('.docs-sidebar');
                                    const overlay = document.querySelector('.sidebar-overlay');

                                    function toggleMenu() {
                                        menuToggle.classList.toggle('active');
                                        sidebar.classList.toggle('active');
                                        overlay.classList.toggle('active');
                                    }

                                    menuToggle.addEventListener('click', toggleMenu);
                                    overlay.addEventListener('click', toggleMenu);

                                    // Marcar el enlace activo
                                    const currentPath = window.location.pathname === '/' ? '/' : window.location.pathname;
                                    document.querySelectorAll('.nav-tree a').forEach(link => {
                                        if (link.getAttribute('href') === currentPath) {
                                            link.classList.add('active');
                                        }
                                    });
                                });
                            </script>
                        </body>
                        </html>`;

                        res.setHeader('Content-Type', 'text/html');
                        res.end(html);
                    } catch (error) {
                        console.error('Error processing markdown:', error);
                        next(error);
                    }
                    return;
                }

                next();
            });
        }
    };
}

export default defineConfig({
    base: '/cerounodostrescuatro/',
    css: {
        devSourcemap: true
    },
    build: {
        outDir: '.temp_build',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    },
    server: {
        watch: {
            include: ['src/**/*.{js,md,css,html}']
        },
        port: 3000,
        open: true
    },
    plugins: [
        markdown({
            mode: ['html']
        }),
        devHtmlPlugin(),
        {
            name: 'build-md',
            async handleHotUpdate({ file, server }) {
                if (file.endsWith('.md') || file.endsWith('.css') || file.endsWith('.js')) {
                    console.log(' Rebuilding...');
                    try {
                        await execAsync('node build.js');
                        console.log(' Build complete');
                        server.ws.send({ type: 'full-reload' });
                    } catch (error) {
                        console.error(' Build failed:', error);
                    }
                }
            }
        },
        {
            name: 'markdown-watch',
            configureServer(server) {
                server.watcher.add('src/content/**/*.md');
                server.watcher.on('change', async (path) => {
                    if (path.endsWith('.md')) {
                        console.log('Markdown file changed, rebuilding...');
                        try {
                            await execAsync('node build.js');
                            console.log('Build completed successfully');
                        } catch (error) {
                            console.error('Build failed:', error);
                        }
                    }
                });
            }
        }
    ]
});
