const chalk = require('chalk');
const { runPrettier } = require('../scripts/format');
const { runLint } = require('../scripts/lint');

class HMRLoggingPlugin {
  constructor() {
    this.isInitialBuild = true; // Tracks if it's the first build
  }

  apply(compiler) {
    // Log before the Webpack build starts
    compiler.hooks.compile.tap('HMRLoggingPlugin', () => {
      if (this.isInitialBuild) {
        console.log(chalk.yellow('Initial Webpack build is starting...'));
        this.isInitialBuild = false; // Ensure this only runs for the first build
        return; // Skip Prettier and Lint on the initial build
      }

      console.log(chalk.yellow('HMR triggered. Running Prettier and Lint...'));

      // Run Prettier and Lint during HMR updates
      Promise.all([runPrettier(), runLint(false)])
        .then(() =>
          console.log(
            chalk.green('Prettier and Lint completed successfully during HMR.')
          )
        )
        .catch((error) =>
          console.error(chalk.red('Error during Prettier/Lint in HMR:', error))
        );
    });

    // Log after the Webpack build completes
    compiler.hooks.done.tap('HMRLoggingPlugin', () => {
      console.log(chalk.green('Webpack build completed. HMR updates applied.'));
    });
  }
}

module.exports = HMRLoggingPlugin;
