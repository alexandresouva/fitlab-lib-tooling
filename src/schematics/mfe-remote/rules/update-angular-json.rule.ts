import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

import { Schema } from '../schema';

export function updateAngularJson(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonBuffer = tree.read('angular.json');

    const hasAngularJson = !!angularJsonBuffer;
    if (!hasAngularJson) return tree;

    const angularJson = JSON.parse(angularJsonBuffer.toString('utf-8'));
    const projectName = `fitlab-mfe-${options.name}`;
    const project = angularJson.projects[projectName];

    const hasArchitectConfig = !!project?.architect;
    if (!hasArchitectConfig) return tree;

    // Karma config
    const architect = project.architect;
    const hasTestConfig = !!architect.test;
    if (hasTestConfig) {
      architect.test.options = architect.test.options || {};
      architect.test.options.karmaConfig = 'karma.conf.js';
    }

    // Native federation proxy config
    const hasServeConfig = !!architect.serve;
    if (hasServeConfig) {
      architect.serve.options = architect.serve.options || {};
      architect.serve.options.port = 0;
    }

    // Dev server config
    const hasOriginalServeConfig = !!architect['serve-original'];
    if (hasOriginalServeConfig) {
      architect['serve-original'].options =
        architect['serve-original'].options || {};
      architect['serve-original'].options.port = Number(options.port) || 4201;
    }

    tree.overwrite('angular.json', JSON.stringify(angularJson, null, 2));
    context.logger.info(
      '✓ Configured karma.conf.js and dev-server ports in angular.json.'
    );

    return tree;
  };
}
