const fs = require('fs');
const path = require('path');

const distDir = path.resolve(__dirname, '../dist');
const filePath = path.join(distDir, '404.html');

const content = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <script>
    window.location.replace('/TeluguWordle/');
  </script>
</head>
<body></body>
</html>
`;

try {
  fs.writeFileSync(filePath, content, { encoding: 'utf8' });
  console.log('✅ Created dist/404.html');
} catch (err) {
  console.error('❌ Failed to create dist/404.html:', err);
  process.exit(1);
}
