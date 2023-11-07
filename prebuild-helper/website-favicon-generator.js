const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const { removeVectornatorAttributes } = require("./image-optimizer");

const iconsInfo = {
  "favicon-32x32.png": 32,
  "favicon-96x96.png": 96,
  "favicon-1024x1024.png": 1024,
  "favicon-192x192.png": 192,
  "favicon-180x180.png": 180,
};

const doLog = false;

const svgFilePath = path.join(__dirname, "website-favicon-raw.svg");
const outputDir = path.join(__dirname, "..", "public", "website-favicon");

function optimizeSVG(filePath) {
  const svgContent = fs.readFileSync(filePath, "utf-8");
  const cleanedSVGContent = removeVectornatorAttributes(svgContent);
  const result = optimize(cleanedSVGContent, {
    plugins: ["preset-default"],
  });
  fs.writeFileSync(filePath, result.data);
}

function generateFavicon() {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(svgFilePath) || !svgFilePath.endsWith(".svg")) {
    console.error("Please provide a valid SVG file path.");
    return;
  }

  optimizeSVG(svgFilePath);

  for (const [iconName, size] of Object.entries(iconsInfo)) {
    sharp(svgFilePath)
      .resize(size, size)
      .toFile(path.join(outputDir, iconName), (err) => {
        if (err) {
          console.error(`Error generating ${iconName}: `, err);
        } else if (doLog) {
          console.log(`Generated ${iconName}`);
        }
      });
  }
}

module.exports = generateFavicon;
