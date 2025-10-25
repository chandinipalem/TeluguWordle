const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "dist", "index.html");

let html = fs.readFileSync(filePath, "utf8");

// Rewrite all root-relative paths to use the base path
html = html.replace(/(href|src)="\/(?!TeluguWordle)/g, '$1="/TeluguWordle/');

// Ensure base tag is correct
if (!html.includes('<base')) {
  html = html.replace('<head>', '<head>\n  <base href="/TeluguWordle/">');
}

fs.writeFileSync(filePath, html);

console.log("✅ Patched base paths in dist/index.html");