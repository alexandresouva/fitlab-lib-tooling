import { Rule, SchematicContext, Tree, chain } from '@angular-devkit/schematics';
import { Schema } from './schema';
import { cleanBoilerplate } from './rules/clean-boilerplate.rule';
import { generateFiles } from './rules/generate-files.rule';
import { updateAngularJson } from './rules/update-angular-json.rule';
import { updatePackageJsonScripts } from './rules/update-package-json.rule';

export function mfeRemote(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info(`🏗️  Structuring MFE Remote project "fitlab-mfe-${options.name}"...`);

    return chain([
      cleanBoilerplate(options),
      generateFiles(options),
      updateAngularJson(options),
      updatePackageJsonScripts()
    ])(tree, context);
  };
}
