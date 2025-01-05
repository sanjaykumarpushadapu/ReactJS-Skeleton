const { checkNodeModules } = require('./checkNodeModules');
const { runPrettier } = require('./format');
const { runLint } = require('./lint');

function preBuild() {
  // Check node_modules
  checkNodeModules();

  // Run format
  runPrettier();

  // Run lint
  runLint();
}
module.exports = {
  preBuild, // Ensure this is exported
};
