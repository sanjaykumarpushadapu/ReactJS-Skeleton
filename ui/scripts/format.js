// //formate.js
const { execSync } = require('child_process');
function runPrettier() {
  try {
    console.log('\x1b[33mRunning Prettier...\x1b[0m');
    execSync(
      "npx prettier --write --log-level silent '**/*.{js,jsx,json,mjs}'",
      {
        stdio: 'inherit',
      }
    );
    console.log('\x1b[32mCode formatted successfully!\x1b[0m');
  } catch {
    console.error('\x1b[31mError formatting code.\x1b[0m');
    process.exit(1);
  }
}
module.exports = {
  runPrettier, // Ensure this is exported
};

// Execute the linting when the script is directly called
if (require.main === module) {
  runPrettier();
}
