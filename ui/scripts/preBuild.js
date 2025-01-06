const { checkNodeModules } = require('./checkNodeModules');
const { runPrettier } = require('./format');
const { runLint } = require('./lint');

function preBuild() {
  // Check node_modules
  checkNodeModules();

  // Run format
  runPrettier();

  // Run lint
  runLint(false);
}
module.exports = {
  preBuild, // Ensure this is exported
};
// Execute the linting when the script is directly called
if (require.main === module) {
  preBuild();
}
