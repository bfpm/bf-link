// Node imports
const fs = require('fs');
const path = require('path');
// External imports
const brnfckr = require('brnfckr');

// Internal imports

// Constants
const DEFAULT_EXT = '.b';


// Create the file loader function
function load(filePath, libPath) {
  // Load the file
  let code = fs.readFileSync(filePath, 'utf8');


  // Set the matching regexes
  const REL_REGEX = /{{(.*?)}}/g;
  const LIB_REGEX = /\(\((.*?)\)\)/g;


  // Get directory of file
  const fileDir = path.dirname(filePath);


  // Loop through all local file imports
  let result;
  while((result = REL_REGEX.exec(code)) !== null) {
    // Resolve the match, setting the path to the absolute path for relative purposes
    const resolvedDependency = load(path.format({
      dir: fileDir,
      name: result[1],
      ext: DEFAULT_EXT
    }), libPath);
    // Replace the {{}} import with the inlined brainf*ck code
    code = code.slice(0, result.index) + resolvedDependency + code.slice(result.index + result[0].length);
  }


  // Loop through all library imports
  result = null;
  while((result = LIB_REGEX.exec(code)) !== null) {
    // Resolve the match
    const resolvedLibrary = fs.readFileSync(path.format({
      dir: libPath,
      name: result[1],
      ext: DEFAULT_EXT
    }), 'utf8');
    // Replace the (()) import with the inlined brainf*ck code
    code = code.slice(0, result.index) + resolvedLibrary + code.slice(result.index + result[0].length);
  }

  // Return code
  return code;
}

module.exports.link = function(inFile, lib) {
  // Inline file
  let inline;
  try {
    inline = load(inFile, lib);
  } catch(e) {
    console.error(e);
    return;
  }

  // Minify file
  return brnfckr.minify(inline);
}
