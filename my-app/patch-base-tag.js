const fs = require("fs");
const path = require("path");

const indexPath = path.join(__dirname, "dist", "index.html");

let html = fs.readFileSync(indexPath, "utf8");

// Rewrite all root-relative paths to use the base path
html = html.replace(/(href|src)="\/(?!TeluguWordle)/g, '$1="/TeluguWordle/');

// Add redirect script to handle hash routing
const redirectScript = `
<script>
  // Redirect to hash route if not already there
  if (!window.location.hash) {
    window.location.replace(window.location.href + '#/');
  }
</script>
`;

html = html.replace('</head>', redirectScript + '</head>');

fs.writeFileSync(indexPath, html);

console.log("✅ Patched base paths and added hash redirect in dist/index.html");