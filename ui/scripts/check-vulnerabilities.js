const { execSync } = require('child_process');
const chalk = require('chalk'); // Install chalk: npm install chalk

// Function to clean output by removing ANSI escape codes
function cleanOutput(output) {
  return output.replace(/\x1B\[\d+m/g, "");
}

try {
  console.log(chalk.bold.blue('\nRunning npm audit...\n'));
  const result = execSync('npm audit --json').toString();
  const cleanResult = cleanOutput(result);  // Clean the result output
  const auditResult = JSON.parse(cleanResult);

  if (auditResult.metadata && auditResult.metadata.vulnerabilities) {
    const { info, low, moderate, high, critical, total } = auditResult.metadata.vulnerabilities;

    // Print summary in color
    console.log(chalk.bold.green('Audit Completed Successfully!\n'));
    console.log(chalk.bold('Vulnerability Summary:'));
    console.log(chalk.cyan(`  Info:      ${info}`));
    console.log(chalk.blue(`  Low:       ${low}`));
    console.log(chalk.yellow(`  Moderate:  ${moderate}`));
    console.log(chalk.red(`  High:      ${high}`));
    console.log(chalk.bold.red(`  Critical:  ${critical}`));
    console.log(chalk.bold(`  Total:     ${total}\n`));

    // Print detailed vulnerability table
    const vulnerabilities = Object.values(auditResult.vulnerabilities).map(vul => ({
      Name: vul.name,
      Severity: cleanOutput(vul.severity), // Clean the severity to remove any ANSI codes
      Range: cleanOutput(vul.range), // Clean the range to remove any ANSI codes
      Affected: vul.effects.join(', '),
      FixAvailable: vul.fixAvailable ? cleanOutput(chalk.green('Yes')) : cleanOutput(chalk.red('No')), // Clean the fix availability
    }));

    console.log(chalk.bold('Detailed Vulnerabilities:'));
    console.table(vulnerabilities); // Display as table
  } else {
    console.log(chalk.bold.green('No vulnerabilities found in metadata!\n'));
  }
} catch (error) {
  console.error(chalk.bold.red('\nError running audit:'));
  console.error(chalk.red(error.message));

  if (error.stdout) {
    console.log(chalk.bold.yellow('\nParsing audit results from error output...\n'));
    try {
      const cleanErrorOutput = cleanOutput(error.stdout.toString());  // Clean error output
      const auditResult = JSON.parse(cleanErrorOutput);
      if (auditResult.metadata && auditResult.metadata.vulnerabilities) {
        const { info, low, moderate, high, critical, total } = auditResult.metadata.vulnerabilities;

        // Print summary in color
        console.log(chalk.bold('Vulnerability Summary (from error):'));
        console.log(chalk.cyan(`  Info:      ${info}`));
        console.log(chalk.blue(`  Low:       ${low}`));
        console.log(chalk.yellow(`  Moderate:  ${moderate}`));
        console.log(chalk.red(`  High:      ${high}`));
        console.log(chalk.bold.red(`  Critical:  ${critical}`));
        console.log(chalk.bold(`  Total:     ${total}\n`));

        // Print detailed vulnerability table
        const vulnerabilities = Object.values(auditResult.vulnerabilities).map(vul => ({
          Name: vul.name,
          Severity: cleanOutput(vul.severity), // Clean the severity to remove any ANSI codes
          Range: cleanOutput(vul.range), // Clean the range to remove any ANSI codes
          Affected: vul.effects.join(', '),
          FixAvailable: vul.fixAvailable ? cleanOutput(chalk.green('Yes')) : cleanOutput(chalk.red('No')), // Clean the fix availability
        }));

        console.log(chalk.bold('Detailed Vulnerabilities (from error):'));
        console.table(vulnerabilities); // Display as table
      } else {
        console.log(chalk.bold.green('No vulnerabilities found in metadata (from error output).\n'));
      }
    } catch (parseError) {
      console.error(chalk.bold.red('Failed to parse audit JSON from stdout.'));
    }
  }

  if (error.stderr) {
    console.log(chalk.bold.red('\nError Details:\n'));
    const cleanErrorDetails = cleanOutput(error.stderr.toString());  // Clean error stderr
    console.log(cleanErrorDetails);
  }
}