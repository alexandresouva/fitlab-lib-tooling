import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Internal helper to ensure standard lifecycle and quality scripts exist in package.json
 */
export function ensurePackageScripts(cwd: string = process.cwd()): void {
  const packageJsonPath = path.join(cwd, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return;
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    packageJson.scripts = packageJson.scripts || {};

    // Standard lifecycle & quality scripts for FitLab MFEs
    packageJson.scripts['start'] = 'ng serve';
    packageJson.scripts['build'] = 'ng build';
    packageJson.scripts['test'] = 'ng test --watch=false --browsers=ChromeHeadlessCI --code-coverage';
    packageJson.scripts['test:watch'] = 'ng test --watch=true';
    packageJson.scripts['test:ci'] = 'ng test --watch=false --browsers=ChromeHeadlessCI --code-coverage';
    packageJson.scripts['lint'] = 'eslint .';
    packageJson.scripts['lint:fix'] = 'eslint . --fix';
    packageJson.scripts['prepare'] = 'husky';

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');
  } catch (err: any) {
    console.error(`❌ Failed to synchronize package.json scripts: ${err.message}`);
  }
}
