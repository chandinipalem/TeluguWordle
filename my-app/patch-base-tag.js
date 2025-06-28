const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dist', 'index.html');
const baseHref = '<base href="/TeluguWordle/">';

try {
  let html = fs.readFileSync(filePath, 'utf8');

  // Only insert if it's not already there
  if (!html.includes(baseHref)) {
    html = html.replace('<head>', `<head>\n  ${baseHref}`);
    fs.writeFileSync(filePath, html, 'utf8');
    console.log('✅ <base> tag injected into dist/index.html');
  } else {
    console.log('ℹ️ <base> tag already exists in dist/index.html');
  }
} catch (err) {
  console.error('❌ Failed to patch index.html:', err);
}
