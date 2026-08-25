const fs2 = require("fs");
const path = require("path");

function mkdirp(dir) { fs2.mkdirSync(dir, { recursive: true }); }
function write(rel, content) {
  const full = path.join(__dirname, rel);
  mkdirp(path.dirname(full));
  fs2.writeFileSync(full, content, "utf-8");
  console.log("  Created:", rel);
}

