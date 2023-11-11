const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// Function to generate a random string
function generateRandomString() {
  return crypto.randomBytes(10).toString("hex");
}

// Function to process a file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes("id random")) return;

  let idMap = {};
  content = content.replace(/id=["']([^"']+)["']/g, (match, id) => {
    if (idMap[id]) return match; // Already processed
    const newId = id.substring(0, 10) + "_" + generateRandomString();
    idMap[id] = newId;
    return `id="${newId}"`;
  });

  Object.keys(idMap).forEach((id) => {
    const newId = idMap[id];
    content = content.replace(
      new RegExp(`xlinkHref="#${id}"`, "g"),
      `xlinkHref="#${newId}"`
    );
    content = content.replace(
      new RegExp(`url\\(#${id}\\)`, "g"),
      `url(#${newId})`
    );
  });

  // Adding 'id random' directive
  content = '"id random";\n\n' + content;

  fs.writeFileSync(filePath, content, "utf8");
}

// Function to recursively find and process files
function findAndProcessFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAndProcessFiles(fullPath);
    } else if (file.endsWith(".tsx")) {
      processFile(fullPath);
    }
  });
}

// Start the process
function randomizeSvg() {
  const directoryPath = path.join(__dirname, "..", "components", "images"); // Replace with the actual directory path
  findAndProcessFiles(directoryPath);
}

module.exports = randomizeSvg;
