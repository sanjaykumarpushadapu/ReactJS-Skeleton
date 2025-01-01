const { execSync } = require('child_process');

try {
  console.log('\x1b[33mRunning ESLint...\x1b[0m');
  execSync('npx eslint --fix .', { stdio: 'inherit' });
  console.log('\x1b[32mLinting completed successfully!\x1b[0m');
} catch {
  console.error('\x1b[31mError during linting.\x1b[0m');
  process.exit(1);
}
