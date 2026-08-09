const tsEslint = require('typescript-eslint');
const boundaries = require('eslint-plugin-boundaries');
const eslintConfigPrettier = require('eslint-config-prettier');

module.exports = [
  // 0. Global ignores for build artifacts and config files
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.husky/**',
      '.angular/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.conf.js',
      'node_modules/**'
    ]
  },

  // 1. Base TypeScript recommended rules
  ...tsEslint.configs.recommended,

  // 2. Strict TypeScript rules (Zero any policy)
  {
    files: ['src/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }
      ]
    }
  },

  // 3. Architectural boundaries configuration for Micro Frontends (ng-cookbook standard)
  {
    files: ['src/**/*.ts'],
    plugins: {
      boundaries: boundaries
    },
    settings: {
      'boundaries/elements': [
        { type: 'core', pattern: 'src/app/core' },
        { type: 'shared', pattern: 'src/app/shared' },
        {
          type: 'feature-data-access',
          pattern: 'src/app/features/*/data-access',
          capture: ['featureName']
        },
        {
          type: 'feature-models',
          pattern: 'src/app/features/*/models',
          capture: ['featureName']
        },
        {
          type: 'feature-application',
          pattern: 'src/app/features/*/application',
          capture: ['featureName']
        },
        {
          type: 'feature-domain',
          pattern: 'src/app/features/*/domain',
          capture: ['featureName']
        },
        {
          type: 'feature-pages',
          pattern: 'src/app/features/*/pages',
          capture: ['featureName']
        },
        {
          type: 'feature-components',
          pattern: 'src/app/features/*/ui/components',
          capture: ['featureName']
        },
        {
          type: 'feature-components',
          pattern: 'src/app/features/*/ui/components/**',
          capture: ['featureName']
        },
        {
          type: 'feature',
          pattern: 'src/app/features/*',
          capture: ['featureName']
        }
      ],
      'boundaries/ignore': [
        'src/app/app.ts',
        'src/app/app.component.ts',
        'src/app/app.routes.ts',
        'src/app/app.config.ts',
        'src/main.ts',
        'src/bootstrap.ts'
      ]
    },
    rules: {
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          policies: [
            {
              from: {
                element: {
                  type: 'feature-application',
                  fileInternalPath: '**/*.store.ts'
                }
              },
              disallow: [
                {
                  to: {
                    element: { type: 'feature-data-access' }
                  }
                }
              ]
            },
            {
              from: { element: { type: 'core' } },
              allow: [{ to: { element: { type: 'shared' } } }]
            },
            {
              from: { element: { type: 'shared' } },
              allow: []
            },
            // Boundaries for Page layer
            {
              from: { element: { type: 'feature-pages' } },
              allow: [
                { to: { element: { type: 'core' } } },
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: {
                      type: 'feature-components',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-application',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-data-access',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-domain',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-models',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                }
              ]
            },
            // Boundaries for Component layer
            {
              from: { element: { type: 'feature-components' } },
              allow: [
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: {
                      type: 'feature-models',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-domain',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                }
              ]
            },
            // Boundaries for Data-Access layer
            {
              from: { element: { type: 'feature-data-access' } },
              allow: [
                { to: { element: { type: 'core' } } },
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: {
                      type: 'feature-models',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-domain',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                }
              ]
            },
            // Boundaries for Application layer
            {
              from: { element: { type: 'feature-application' } },
              allow: [
                { to: { element: { type: 'core' } } },
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: {
                      type: 'feature-models',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-domain',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-data-access',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                }
              ]
            },
            // Boundaries for Domain layer
            {
              from: { element: { type: 'feature-domain' } },
              allow: [{ to: { element: { type: 'shared' } } }]
            },
            // Boundaries for Models layer
            {
              from: { element: { type: 'feature-models' } },
              allow: [{ to: { element: { type: 'shared' } } }]
            },
            // Boundaries for root Feature files (like route configurations)
            {
              from: { element: { type: 'feature' } },
              allow: [
                { to: { element: { type: 'core' } } },
                { to: { element: { type: 'shared' } } },
                {
                  to: {
                    element: {
                      type: 'feature-pages',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-components',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-data-access',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-domain',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    }
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-application',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                },
                {
                  to: {
                    element: {
                      type: 'feature-models',
                      captured: { featureName: '{{from.captured.featureName}}' }
                    },
                    fileInternalPath: 'index.ts'
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  },

  // 4. Prettier override to disable conflicting formatting rules
  eslintConfigPrettier
];
