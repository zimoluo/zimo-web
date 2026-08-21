const optimizeResource = require("./image-optimizer");
const generateFavicon = require("./website-favicon-generator");

console.log("Running custom prebuild scripts...");

optimizeResource();
generateFavicon();
