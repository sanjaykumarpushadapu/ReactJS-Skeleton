const chalk = require('chalk');
const { runPrettier } = require('./format'); // Correct the path to where runPrettier is located
const { runLint } = require('./lint'); // Correct the path to where runPrettier is located
class HMRLoggingPlugin {
  constructor() {
    this.firstBuild = true;
  }

  apply(compiler) {
    // Log before the Webpack build starts (after the first build)
    compiler.hooks.compile.tap('HMRLoggingPlugin', () => {
      if (!this.firstBuild) {
        console.log(chalk.yellow('Webpack build is about to start...'));
      }
    });

    // Log after the Webpack build completes (HMR updates applied)
    compiler.hooks.done.tap('HMRLoggingPlugin', () => {
      console.log(chalk.green('Webpack build completed. HMR updates applied.'));
      this.firstBuild = false;

      // Run Prettier
      runPrettier();
      // Run lint
      runLint(false);
    });
  }
}

module.exports = HMRLoggingPlugin;
