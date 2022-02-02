// customPath.js
//
const path = require("path");

const fullPath = path.parse(__filename).dir;
const fullPathArray = fullPath.split("/");
const MAIN_FOLDER = fullPathArray[fullPathArray.length - 2];

function customPath(relativePath) {
  const parsedPath = path.parse(__filename);
  let fullPathSplit = parsedPath.dir.split("/");

  for (let value of fullPathSplit) {
    if (fullPathSplit[fullPathSplit.length - 1] === MAIN_FOLDER) {
      break;
    } else {
      fullPathSplit.pop();
    }
  }
  fullPathSplit.push(relativePath);

  return fullPathSplit.join("/");
}

module.exports = customPath;
