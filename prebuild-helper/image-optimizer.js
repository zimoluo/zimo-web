const fs = require("fs");
const path = require("path");
const { optimize } = require("svgo");
const glob = require("glob");

function removeVectornatorAttributes(svgContent) {
  return svgContent.replace(
    /vectornator:[^\s=]+="[^"]*"|vectornator:[^\s=]+='[^']*'/g,
    ""
  );
}

function optimizeSvg(filePath) {
  const doLog = false;

  try {
    let svgContent = fs.readFileSync(filePath, "utf-8");
    const originalSize = Buffer.byteLength(svgContent, "utf8");

    svgContent = removeVectornatorAttributes(svgContent);

    const result = optimize(svgContent, {
      plugins: ["preset-default"],
    });

    const optimizedSize = Buffer.byteLength(result.data, "utf8");
    const sizeDifference = originalSize - optimizedSize;
    const percentReduction = ((sizeDifference / originalSize) * 100).toFixed(2);

    if (sizeDifference === 0) {
      if (doLog) {
        console.log(
          `No optimization necessary for ${filePath}; file size is already optimal.`
        );
      }
      return;
    }

    fs.writeFileSync(filePath, result.data);

    if (doLog) {
      console.log(`Optimized ${filePath}:`);
      console.log(`  Original Size: ${originalSize} bytes`);
      console.log(`  Optimized Size: ${optimizedSize} bytes`);
      console.log(`  Reduction: ${percentReduction}%`);
    }
  } catch (error) {
    console.error(`Failed to optimize SVG ${filePath}:`, error);
  }
}

function optimizeSvgsInFolder(folderPath) {
  const svgFiles = glob.sync(path.join(folderPath, "**/*.svg"));
  svgFiles.forEach(optimizeSvg);
}

function optimizeResource() {
  optimizeSvgsInFolder(path.join(__dirname, "..", "public"));
}

module.exports = optimizeResource;
module.exports.removeVectornatorAttributes = removeVectornatorAttributes;
