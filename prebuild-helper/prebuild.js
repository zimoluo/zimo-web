const optimizeResource = require("./image-optimizer");
const generateFavicon = require("./website-favicon-generator");
const randomizeSvg = require("./svg-id-randomizer");

console.log("Running custom prebuild scripts...");

optimizeResource();
generateFavicon();
randomizeSvg();
