const { execSync } = require('child_process');
const sass = require('sass');

// Function to compile Sass using sass package
function compileSass() {
  try {
    console.log('\x1b[33mCompiling Sass files...\x1b[0m');
    sass.renderSync({
      file: './src/styles/main.scss', // Your main SCSS file
      outFile: './src/styles/main.css', // Optional: output path
      sourceMap: true, // Optional: source map for better debugging
    });
    console.log('\x1b[32mSass compiled successfully!\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mError during Sass compilation.\x1b[0m');
    console.error(err.message);
    process.exit(1); // Exit if compilation fails
  }
}

function runStyleLint(isProcessStop = true) {
  try {
    console.log('\x1b[33mRunning Stylelint...\x1b[0m');
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

// Run both Sass compilation and Stylelint
function runFullBuild() {
  compileSass(); // Compile Sass files
  runStyleLint(); // Run Stylelint
}

// Execute the linting when the script is directly called
if (require.main === module) {
  runFullBuild();
}

module.exports = {
  runFullBuild,
  runStyleLint,
};
