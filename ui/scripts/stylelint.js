const { execSync } = require('child_process');
const sass = require('sass');

// Single function to compile Sass and run Stylelint
function runStyleLint(isProcessStop = true) {
  try {
    // Compile Sass files using the new Dart Sass API (compileSync)
    console.log('\x1b[33mCompiling Sass files...\x1b[0m');
    sass.compile('./src/styles/main.scss', {
      sourceMap: true, // Optional: source map for better debugging
      outFile: './src/styles/main.css', // Optional: output path
    });

    // Output the compiled CSS (Optional)
    //console.log(result.css.toString());

    console.log('\x1b[32mSass compiled successfully!\x1b[0m');

    // Run Stylelint
    console.log('\x1b[33mRunning Stylelint...\x1b[0m');
    execSync('npx stylelint "**/*.scss" --fix', { stdio: 'inherit' });
    console.log('\x1b[32mLinting completed successfully!\x1b[0m');
  } catch (err) {
    console.error('\x1b[31mError during build process.\x1b[0m');
    console.error(err.message);

    // Stop process if specified
    if (isProcessStop) {
      process.exit(1);
    }
  }
}

// Execute the build when the script is directly called
if (require.main === module) {
  runStyleLint();
}

module.exports = {
  runStyleLint,
};
