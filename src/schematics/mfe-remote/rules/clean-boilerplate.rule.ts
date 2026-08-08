import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { Schema } from '../schema';

export function cleanBoilerplate(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonBuffer = tree.read('angular.json');
    if (!angularJsonBuffer) {
      throw new Error('Could not find angular.json in the workspace root.');
    }

    const angularJson = JSON.parse(angularJsonBuffer.toString('utf-8'));
    const projectName = `fitlab-mfe-${options.name}`;
    const project = angularJson.projects[projectName];
    if (!project) {
      throw new Error(`Project "${projectName}" not found in angular.json.`);
    }

    const sourceRoot = project.sourceRoot || 'src';
    const appDir = `${sourceRoot}/app`;
    const boilerplateFiles = [
      `${appDir}/app.component.ts`,
      `${appDir}/app.component.html`,
      `${appDir}/app.component.scss`,
      `${appDir}/app.component.css`,
      `${appDir}/app.component.spec.ts`,
      `${appDir}/app.routes.ts`,
      `${appDir}/app.config.ts`
    ];

    boilerplateFiles.forEach((file) => {
      if (tree.exists(file)) {
        tree.delete(file);
      }
    });

    context.logger.info('✓ Cleaned standard Angular boilerplate files.');
    return tree;
  };
}
