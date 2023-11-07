import fs from "fs";
import path from "path";
import { optimize } from "svgo";
import glob from "glob";

function removeVectornatorAttributes(svgContent: string) {
  return svgContent.replace(
    /vectornator:[^\s=]+="[^"]*"|vectornator:[^\s=]+='[^']*'/g,
    ""
  );
}

function optimizeSvg(filePath: fs.PathOrFileDescriptor) {
  try {
    let svgContent = fs.readFileSync(filePath, "utf-8");
    const originalSize = Buffer.byteLength(svgContent, "utf8");

    // Remove vectornator attributes before optimizing
    svgContent = removeVectornatorAttributes(svgContent);

    const result = optimize(svgContent, {
      plugins: ["preset-default"],
      // Configure more plugins or settings as needed
    });

    const optimizedSize = Buffer.byteLength(result.data, "utf8");
    const sizeDifference = originalSize - optimizedSize;
    const percentReduction = ((sizeDifference / originalSize) * 100).toFixed(2);

    if (sizeDifference === 0) {
      console.log(
        `No optimization necessary for ${filePath}; file size is already optimal.`
      );
      return;
    }

    fs.writeFileSync(filePath, result.data);

    console.log(`Optimized ${filePath}:`);
    console.log(`  Original Size: ${originalSize} bytes`);
    console.log(`  Optimized Size: ${optimizedSize} bytes`);
    console.log(`  Reduction: ${percentReduction}%`);
  } catch (error) {
    console.error(`Failed to optimize SVG ${filePath}:`, error);
  }
}

function optimizeSvgsInFolder(folderPath: string) {
  const svgFiles = glob.sync(path.join(folderPath, "**/*.svg"));
  svgFiles.forEach(optimizeSvg);
}

export function optimizeResource() {
  optimizeSvgsInFolder("@/public");
}
