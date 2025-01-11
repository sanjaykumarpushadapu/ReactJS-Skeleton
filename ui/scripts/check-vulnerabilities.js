const { execSync } = require('child_process');
const chalk = require('chalk'); // Install chalk: npm install chalk

try {
  console.log(chalk.bold.blue('\nRunning npm audit...\n'));
  const result = execSync('npm audit --json').toString();
  const auditResult = JSON.parse(result);

  if (auditResult.metadata && auditResult.metadata.vulnerabilities) {
    const { info, low, moderate, high, critical, total } = auditResult.metadata.vulnerabilities;

    console.log(chalk.bold.green('Audit Completed Successfully!\n'));
    console.log(chalk.bold('Vulnerability Summary:'));
    console.log(chalk.cyan(`  Info:      ${info}`));
    console.log(chalk.blue(`  Low:       ${low}`));
    console.log(chalk.yellow(`  Moderate:  ${moderate}`));
    console.log(chalk.red(`  High:      ${high}`));
    console.log(chalk.bold.red(`  Critical:  ${critical}`));
    console.log(chalk.bold(`  Total:     ${total}\n`));
  } else {
    console.log(chalk.bold.green('No vulnerabilities found in metadata!\n'));
  }
} catch (error) {
  console.error(chalk.bold.red('\nError running audit:'));
  console.error(chalk.red(error.message));

  if (error.stdout) {
    console.log(chalk.bold.yellow('\nParsing audit results from error output...\n'));
    try {
      const auditResult = JSON.parse(error.stdout.toString());
      if (auditResult.metadata && auditResult.metadata.vulnerabilities) {
        const { info, low, moderate, high, critical, total } = auditResult.metadata.vulnerabilities;

        console.log(chalk.bold('Vulnerability Summary (from error):'));
        console.log(chalk.cyan(`  Info:      ${info}`));
        console.log(chalk.blue(`  Low:       ${low}`));
        console.log(chalk.yellow(`  Moderate:  ${moderate}`));
        console.log(chalk.red(`  High:      ${high}`));
        console.log(chalk.bold.red(`  Critical:  ${critical}`));
        console.log(chalk.bold(`  Total:     ${total}\n`));
      } else {
        console.log(chalk.bold.green('No vulnerabilities found in metadata (from error output).\n'));
      }
    } catch (parseError) {
      console.error(chalk.bold.red('Failed to parse audit JSON from stdout.'));
    }
  }

  if (error.stderr) {
    console.log(chalk.bold.red('\nError Details:\n'));
    console.log(error.stderr.toString());
  }
}