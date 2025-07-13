const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'index.html');
const baseHref = '<base href="/TeluguWordle/">';

try {
  let html = fs.readFileSync(filePath, 'utf8');

  // Inject base href if missing
  if (!html.includes(baseHref)) {
    html = html.replace('<head>', `<head>\n  ${baseHref}`);
  }

  // Replace hardcoded asset URLs
  html = html
    .replace(/(src|href)="\/(static|_expo|assets)/g, '$1="/TeluguWordle/$2')
    .replace(/content="\/(static|_expo|assets)/g, 'content="/TeluguWordle/$1');

  fs.writeFileSync(filePath, html, 'utf8');
  console.log('✅ Patched index.html with base href and path fixes.');
} catch (err) {
  console.error('❌ Failed to patch index.html:', err);
}
