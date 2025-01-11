const { execSync } = require('child_process');

try {
  console.log('Running npm audit...');
  const result = execSync('npm audit --json').toString();
  const auditResult = JSON.parse(result);

  // Check for metadata and vulnerabilities
  if (auditResult.metadata && auditResult.metadata.vulnerabilities) {
    const { info, low, moderate, high, critical, total } = auditResult.metadata.vulnerabilities;
    console.log('Vulnerability Summary:');
    console.log(`  Info: ${info}`);
    console.log(`  Low: ${low}`);
    console.log(`  Moderate: ${moderate}`);
    console.log(`  High: ${high}`);
    console.log(`  Critical: ${critical}`);
    console.log(`  Total: ${total}`);
  } else {
    console.log('No vulnerabilities found in metadata.');
  }

  // Optionally, log the full result for debugging
  // console.log(JSON.stringify(auditResult, null, 2));
} catch (error) {
  console.error('Error running audit:');
  console.error(error.message);

  // Display stdout and stderr for troubleshooting
  if (error.stdout) {
   
    try {
      const auditResult = JSON.parse(error.stdout.toString());
      if (auditResult.metadata && auditResult.metadata.vulnerabilities) {
        const { info, low, moderate, high, critical, total } = auditResult.metadata.vulnerabilities;
        console.log('Vulnerability Summary (from error):');
        console.log(`  Info: ${info}`);
        console.log(`  Low: ${low}`);
        console.log(`  Moderate: ${moderate}`);
        console.log(`  High: ${high}`);
        console.log(`  Critical: ${critical}`);
        console.log(`  Total: ${total}`);
      } else {
        console.log('No vulnerabilities found in metadata (from error output).');
      }
    } catch (parseError) {
      console.error('Failed to parse audit JSON from stdout.');
    }
  }

  if (error.stderr) {
    console.log('stderr Error :', error.stderr.toString());
  }
}