import { Rule, SchematicContext, Tree, apply, url, applyTemplates, move, mergeWith, MergeStrategy, chain } from "@angular-devkit/schematics";
import { strings } from "@angular-devkit/core";
import { Schema } from "./schema";

export function mfeRemote(options: Schema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info(`🏗️  Structuring MFE Remote project "fitlab-mfe-${options.name}"...`);

    // 1. Read angular.json to find the project source root
    const angularJsonBuffer = tree.read("angular.json");
    if (!angularJsonBuffer) {
      throw new Error("Could not find angular.json in the workspace root.");
    }
    const angularJson = JSON.parse(angularJsonBuffer.toString("utf-8"));
    const projectName = `fitlab-mfe-${options.name}`;
    const project = angularJson.projects[projectName];
    if (!project) {
      throw new Error(`Project "${projectName}" not found in angular.json.`);
    }

    const sourceRoot = project.sourceRoot || 'src';
    const projectRoot = project.root ?? '';

    // 2. Delete standard Angular boilerplate files to keep the structure clean
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

    // 3. Load templates from './files' and apply EJS options interpolation
    const templateSource = apply(url('./files'), [
      applyTemplates({
        ...options,
        ...strings
      }),
      move(projectRoot)
    ]);

    // 4. Merge templates and update root package.json scripts
    return chain([
      mergeWith(templateSource, MergeStrategy.Overwrite),
      updatePackageJsonScripts()
    ])(tree, context);
  };
}

function updatePackageJsonScripts(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⚙️  Configuring root package.json start and build scripts...');
    const packageJsonBuffer = tree.read('package.json');
    if (packageJsonBuffer) {
      const packageJson = JSON.parse(packageJsonBuffer.toString('utf-8'));
      packageJson.scripts = packageJson.scripts || {};
      packageJson.scripts.start = 'ng serve';
      packageJson.scripts.build = 'ng build';
      tree.overwrite('package.json', JSON.stringify(packageJson, null, 2));
      context.logger.info('✓ Updated package.json scripts.');
    }
    return tree;
  };
}
