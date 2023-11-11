const optimizeResource = require("./image-optimizer");
const generateFavicon = require("./website-favicon-generator");
const randomizeSvg = require("./svg-id-randomizer");

optimizeResource();
generateFavicon();
randomizeSvg();
