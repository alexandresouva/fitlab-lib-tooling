import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

export function initLint(cwd: string = process.cwd()): void {
  console.log('⚙️  Setting up ESLint Flat Config & Architecture Boundaries...');

  // 1. Install peer devDependencies
  try {
    console.log(
      '   Installing peer devDependencies (eslint, typescript-eslint, boundaries)...'
    );
    execSync(
      'npm install -D eslint typescript-eslint eslint-plugin-boundaries eslint-config-prettier',
      { stdio: 'ignore', cwd }
    );
    console.log('✓ ESLint peer dependencies installed successfully.');
  } catch (err: any) {
    console.error(`❌ Failed to install ESLint dependencies: ${err.message}`);
    process.exit(1);
  }

  // 2. Create eslint.config.mjs
  const eslintConfigMjsPath = path.join(cwd, 'eslint.config.mjs');
  const eslintConfigJsPath = path.join(cwd, 'eslint.config.js');
  if (fs.existsSync(eslintConfigJsPath)) {
    fs.rmSync(eslintConfigJsPath, { force: true });
  }

  const eslintConfigContent = `import fitlabLint from '@fitlab/tooling/eslint';

export default [
  ...fitlabLint
];
`;

  try {
    fs.writeFileSync(eslintConfigMjsPath, eslintConfigContent, {
      encoding: 'utf8'
    });
    console.log(
      '✓ Created eslint.config.mjs pointing to @fitlab/tooling/eslint'
    );
  } catch (err: any) {
    console.error(`❌ Failed to create eslint.config.mjs: ${err.message}`);
    process.exit(1);
  }

  // 3. Update package.json scripts
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['lint'] = 'eslint .';
      packageJson.scripts['lint:fix'] = 'eslint . --fix';
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        'utf8'
      );
      console.log('✓ Added "lint" and "lint:fix" scripts to package.json');
    } catch (err: any) {
      console.error(
        `❌ Failed to update package.json with lint scripts: ${err.message}`
      );
      process.exit(1);
    }
  }
}
