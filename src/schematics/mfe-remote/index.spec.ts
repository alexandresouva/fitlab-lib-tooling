import * as path from 'node:path';

import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import { describe, it, expect, beforeEach } from 'vitest';

const collectionPath = path.join(
  __dirname,
  '../../../dist/schematics/collection.json'
);

describe('mfe-remote schematic', () => {
  let runner: SchematicTestRunner;
  let tree: UnitTestTree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    tree = new UnitTestTree(Tree.empty());

    // Setup mock workspace structure with angular.json and package.json
    tree.create(
      '/angular.json',
      JSON.stringify({
        projects: {
          'fitlab-mfe-auth': {
            root: '',
            sourceRoot: 'src',
            architect: {
              test: {
                builder: '@angular-devkit/build-angular:karma',
                options: {}
              }
            }
          }
        }
      })
    );

    tree.create(
      '/package.json',
      JSON.stringify({
        name: 'fitlab-mfe-auth',
        scripts: {}
      })
    );

    // Create boilerplate files that should be cleaned
    const appDir = '/src/app';
    tree.create(`${appDir}/app.component.ts`, 'export class AppComponent {}');
    tree.create(`${appDir}/app.component.html`, '<p>App</p>');
    tree.create(`${appDir}/app.component.scss`, '');
    tree.create(`${appDir}/app.component.spec.ts`, '');
    tree.create(`${appDir}/app.routes.ts`, '');
    tree.create(`${appDir}/app.config.ts`, '');
  });

  it('should clean Angular boilerplate files and generate MFE templates', async () => {
    const resultTree = await runner.runSchematic(
      'mfe-remote',
      { name: 'auth', port: 4205 },
      tree
    );

    const appDir = '/src/app';
    // Boilerplate files removed
    expect(resultTree.exists(`${appDir}/app.component.html`)).toBe(false);
    expect(resultTree.exists(`${appDir}/app.component.scss`)).toBe(false);
    expect(resultTree.exists(`${appDir}/app.component.spec.ts`)).toBe(false);

    // New MFE template files generated
    expect(resultTree.exists('/karma.conf.js')).toBe(true);
    expect(resultTree.exists('/federation.config.js')).toBe(true);
    expect(resultTree.exists('/tsconfig.app.json')).toBe(true);
    expect(resultTree.exists('/src/main.ts')).toBe(true);
    expect(resultTree.exists('/src/bootstrap.ts')).toBe(true);
    expect(resultTree.exists('/src/styles.scss')).toBe(true);
    expect(resultTree.exists('/src/app/app.ts')).toBe(true);
    expect(resultTree.exists('/src/app/app.config.ts')).toBe(true);
    expect(resultTree.exists('/src/app/app.routes.ts')).toBe(true);
    expect(resultTree.exists('/src/app/app.spec.ts')).toBe(true);
  });

  it('should update angular.json with karmaConfig', async () => {
    const resultTree = await runner.runSchematic(
      'mfe-remote',
      { name: 'auth', port: 4205 },
      tree
    );
    const angularJson = JSON.parse(resultTree.readContent('/angular.json'));

    expect(
      angularJson.projects['fitlab-mfe-auth'].architect.test.options.karmaConfig
    ).toBe('karma.conf.js');
  });

  it('should update package.json with standard start, build, and test scripts', async () => {
    const resultTree = await runner.runSchematic(
      'mfe-remote',
      { name: 'auth', port: 4205 },
      tree
    );
    const packageJson = JSON.parse(resultTree.readContent('/package.json'));

    expect(packageJson.scripts.start).toBe('ng serve');
    expect(packageJson.scripts.build).toBe('ng build');
    expect(packageJson.scripts.test).toBe(
      'ng test --watch=false --browsers=ChromeHeadlessCI'
    );
    expect(packageJson.scripts['test:watch']).toBe('ng test --watch=true');
    expect(packageJson.scripts['test:ci']).toBe(
      'ng test --watch=false --browsers=ChromeHeadlessCI'
    );
  });
});
