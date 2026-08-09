import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { Schema } from '../schema';

export function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonBuffer = tree.read('angular.json');
    if (angularJsonBuffer) {
      const angularJson = JSON.parse(angularJsonBuffer.toString('utf-8'));
      const projectName = `fitlab-mfe-${options.name}`;
      const project = angularJson.projects[projectName];
      if (project?.architect?.test) {
        project.architect.test.options = project.architect.test.options || {};
        project.architect.test.options.karmaConfig = 'karma.conf.js';
        tree.overwrite('angular.json', JSON.stringify(angularJson, null, 2));
        context.logger.info('✓ Configured karma.conf.js in angular.json.');
      }
    }
    return tree;
  };
}
