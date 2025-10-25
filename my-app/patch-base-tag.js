// patch-base-tag.js
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "dist", "index.html");

let html = fs.readFileSync(filePath, "utf8");


fs.writeFileSync(filePath, html);

console.log("✅ Using root deployment - no path patching needed");
