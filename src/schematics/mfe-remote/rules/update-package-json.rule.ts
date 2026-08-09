import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function updatePackageJsonScripts(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info(
      '⚙️  Configuring root package.json start, build, and test scripts...'
    );
    const packageJsonBuffer = tree.read('package.json');
    if (packageJsonBuffer) {
      const packageJson = JSON.parse(packageJsonBuffer.toString('utf-8'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.start = 'ng serve';
      packageJson.scripts.build = 'ng build';
      packageJson.scripts.test =
        'ng test --watch=false --browsers=ChromeHeadlessCI';
      packageJson.scripts['test:watch'] = 'ng test --watch=true';
      packageJson.scripts['test:ci'] =
        'ng test --watch=false --browsers=ChromeHeadlessCI';
      tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
      context.logger.info('✓ Updated package.json scripts.');
    }
    return tree;
  };
}
