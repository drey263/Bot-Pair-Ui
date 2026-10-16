import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distDir = path.resolve(__dirname, '../dist');

if (!fs.existsSync(distDir)) {
  console.error('dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const indexHtmlPath = path.join(distDir, 'index.html');
if (!fs.existsSync(indexHtmlPath)) {
  console.error('dist/index.html does not exist.');
  process.exit(1);
}

const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');

// List of routes to pre-generate for static web hosting (Render, GitHub Pages, Netlify, etc.)
const routes = [
  'services/channel-reactions',
  'services/poll-votes',
  'services',
  'pairing',
];

routes.forEach((route) => {
  // 1. Directory with index.html (e.g. dist/services/channel-reactions/index.html)
  const targetDir = path.join(distDir, route);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), indexHtml, 'utf8');

  // 2. Direct HTML file (e.g. dist/services/channel-reactions.html)
  const directHtml = path.join(distDir, `${route}.html`);
  fs.mkdirSync(path.dirname(directHtml), { recursive: true });
  fs.writeFileSync(directHtml, indexHtml, 'utf8');

  console.log(`Generated static routes: dist/${route}/index.html and dist/${route}.html`);
});

// Create 404.html fallback duplicate of index.html so any 404 renders SPA directly
fs.writeFileSync(path.join(distDir, '404.html'), indexHtml, 'utf8');
console.log('Generated static SPA fallback: dist/404.html');

// Ensure _redirects is in dist
const redirectsContent = '/*    /index.html   200\n';
fs.writeFileSync(path.join(distDir, '_redirects'), redirectsContent, 'utf8');
console.log('Generated dist/_redirects for Render');

// Ensure render.yaml is accessible in dist if copied
const renderYaml = `services:
  - type: web
    name: voltra-bot-md
    env: static
    buildCommand: npm run build
    staticPublishPath: ./dist
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
`;
fs.writeFileSync(path.join(distDir, 'render.yaml'), renderYaml, 'utf8');
console.log('Generated dist/render.yaml');
