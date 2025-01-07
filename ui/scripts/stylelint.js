const { execSync } = require('child_process');

function runStyleLint(isProcessStop = true) {
  try {
    console.log('\x1b[33mRunning Stylelint...\x1b[0m'); // Corrected message
    execSync('npx stylelint "**/*.scss" --fix', { stdio: 'inherit' });
    console.log('\x1b[32mLinting completed successfully!\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mError during linting.\x1b[0m');
    console.error(err.message);

    // Stop process if specified
    if (isProcessStop) {
      process.exit(1);
    }
  }
}

// Export the function to make it reusable
module.exports = {
  runStyleLint,
};

// Execute the linting when the script is directly called
if (require.main === module) {
  runStyleLint();
}
