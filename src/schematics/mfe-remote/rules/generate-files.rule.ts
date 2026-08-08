import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  url,
  applyTemplates,
  move,
  mergeWith,
  MergeStrategy
} from '@angular-devkit/schematics';
import { strings } from '@angular-devkit/core';
import { Schema } from '../schema';

export function generateFiles(options: Schema): Rule {
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

    const projectRoot = project.root ?? '';
    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...options,
        ...strings
      }),
      move(projectRoot)
    ]);

    return mergeWith(templateSource, MergeStrategy.Overwrite)(tree, context);
  };
}
