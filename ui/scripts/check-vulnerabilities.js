const { execSync } = require('child_process');

try {
  console.log('Running npm audit...');
  const result = execSync('npm audit --json').toString();
  const auditResult = JSON.parse(result);

  if (auditResult.vulnerabilities) {
    console.log('Vulnerabilities found:', auditResult.vulnerabilities);
  } else {
    console.log('No vulnerabilities found');
  }
} catch (error) {
  console.error('Error running audit:');
  console.error(error.message);
  if (error.stdout) {
    console.log('stdout:', error.stdout.toString());
  }
  if (error.stderr) {
    console.log('stderr:', error.stderr.toString());
  }
}