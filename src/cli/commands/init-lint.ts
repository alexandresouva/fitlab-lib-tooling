import { execSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';

const PRETTIER_CONFIG = {
  singleQuote: true,
  trailingComma: 'none',
  tabWidth: 2,
  useTabs: false,
  semi: true,
  printWidth: 80,
  bracketSpacing: true,
  arrowParens: 'always',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto'
};

const PRETTIER_IGNORE = `dist
coverage
.angular
.husky
node_modules
package-lock.json
`;

export function initLint(cwd: string = process.cwd()): void {
  console.log(
    '⚙️  Setting up ESLint, Prettier, Import Order & Architecture Boundaries...'
  );

  // 1. Install peer devDependencies
  try {
    console.log(
      '   Installing peer devDependencies (eslint, typescript-eslint, boundaries, prettier, plugins)...'
    );
    execSync(
      'npm install -D eslint typescript-eslint eslint-plugin-boundaries eslint-config-prettier prettier eslint-plugin-prettier eslint-plugin-import-x',
      { stdio: 'ignore', cwd }
    );
    console.log(
      '✓ ESLint, Prettier, and Import plugins installed successfully.'
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to install linting dependencies: ${msg}`);
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
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to create eslint.config.mjs: ${msg}`);
    process.exit(1);
  }

  // 3. Create .prettierrc and .prettierignore
  const prettierRcPath = path.join(cwd, '.prettierrc');
  const prettierIgnorePath = path.join(cwd, '.prettierignore');

  try {
    fs.writeFileSync(
      prettierRcPath,
      JSON.stringify(PRETTIER_CONFIG, null, 2) + '\n',
      { encoding: 'utf8' }
    );
    fs.writeFileSync(prettierIgnorePath, PRETTIER_IGNORE, {
      encoding: 'utf8'
    });
    console.log('✓ Created .prettierrc and .prettierignore');
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to create Prettier configuration: ${msg}`);
    process.exit(1);
  }

  // 4. Update package.json scripts
  const packageJsonPath = path.join(cwd, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts['lint'] = 'eslint .';
      packageJson.scripts['lint:fix'] = 'eslint . --fix';
      packageJson.scripts['format'] = 'prettier --write .';
      packageJson.scripts['format:check'] = 'prettier --check .';
      fs.writeFileSync(
        packageJsonPath,
        JSON.stringify(packageJson, null, 2),
        'utf8'
      );
      console.log(
        '✓ Added "lint", "lint:fix", "format", and "format:check" scripts to package.json'
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error(
        `❌ Failed to update package.json with lint scripts: ${msg}`
      );
      process.exit(1);
    }
  }
}
