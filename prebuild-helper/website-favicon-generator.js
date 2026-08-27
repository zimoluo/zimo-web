const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const iconsInfo = {
  "favicon-32x32.png": 32,
  "favicon-96x96.png": 96,
  "favicon-1024x1024.png": 1024,
  "favicon-192x192.png": 192,
  "favicon-180x180.png": 180,
};

const environments = ["production", "preview", "development"];
const doLog = false;

function generateFaviconForEnv(env) {
  const svgFileName = `${env}-favicon-raw.svg`;
  const svgFilePath = path.join(__dirname, svgFileName);
  const outputDir = path.join(
    __dirname,
    "..",
    "public",
    "website-favicon",
    env,
  );

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  if (!fs.existsSync(svgFilePath) || !svgFilePath.endsWith(".svg")) {
    console.error(`Please provide a valid SVG file path for ${env}.`);
    return;
  }

  for (const [iconName, size] of Object.entries(iconsInfo)) {
    sharp(svgFilePath)
      .resize(size, size)
      .png({
        compressionLevel: 9,
      })
      .toFile(path.join(outputDir, iconName), (err) => {
        if (err) {
          console.error(`Error generating ${iconName} for ${env}: `, err);
        } else if (doLog) {
          console.log(`Generated ${iconName} for ${env}`);
        }
      });
  }
}

function generateFavicon() {
  environments.forEach((env) => generateFaviconForEnv(env));
}

module.exports = generateFavicon;
