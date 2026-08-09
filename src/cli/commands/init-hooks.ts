import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

export function initHooks(cwd: string = process.cwd()): void {
  console.log('⚙️  Setting up Husky Git Hooks and Commitlint...');

  // 1. Install peer devDependencies
  try {
    console.log('   Installing peer devDependencies (husky, commitlint)...');
    execSync(
      'npm install -D husky @commitlint/cli @commitlint/config-conventional',
      { stdio: 'ignore', cwd }
    );
    console.log('✓ Peer dependencies installed successfully.');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to install dependencies: ${msg}`);
    process.exit(1);
  }

  // 2. Run npx husky init to scaffold .husky directory
  try {
    console.log("   Running 'npx husky init'...");
    execSync('npx husky init', { stdio: 'ignore', cwd });
    console.log('✓ Husky initialized successfully.');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to initialize Husky: ${msg}`);
    process.exit(1);
  }

  // 2. Create commitlint.config.js
  const commitlintPath = path.join(cwd, 'commitlint.config.js');
  const commitlintContent = `module.exports = require('@fitlab/tooling/husky/commitlint.config.js');\n`;

  try {
    fs.writeFileSync(commitlintPath, commitlintContent, { encoding: 'utf8' });
    console.log('✓ Created commitlint.config.js extending @fitlab/tooling');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to create commitlint.config.js: ${msg}`);
    process.exit(1);
  }

  // 3. Configure .husky/commit-msg hook
  const commitMsgHookPath = path.join(cwd, '.husky', 'commit-msg');
  const commitMsgHookContent = `npx --no -- commitlint --edit "$1"\n`;

  try {
    fs.writeFileSync(commitMsgHookPath, commitMsgHookContent, {
      encoding: 'utf8',
      mode: 0o755
    });
    console.log('✓ Configured commit-msg hook for Commitlint.');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to create .husky/commit-msg: ${msg}`);
    process.exit(1);
  }

  // 4. Configure .husky/pre-commit hook (runs build & test)
  const preCommitHookPath = path.join(cwd, '.husky', 'pre-commit');
  const preCommitHookContent = `npm run build && npm test\n`;

  try {
    fs.writeFileSync(preCommitHookPath, preCommitHookContent, {
      encoding: 'utf8',
      mode: 0o755
    });
    console.log('✓ Configured pre-commit hook to run build & test.');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to create .husky/pre-commit: ${msg}`);
    process.exit(1);
  }
}
