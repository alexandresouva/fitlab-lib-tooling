const tsEslint = require("typescript-eslint");
const boundaries = require("eslint-plugin-boundaries");
const eslintConfigPrettier = require("eslint-config-prettier");

module.exports = [
  // 1. Base TypeScript recommended rules
  ...tsEslint.configs.recommended,

  // 2. Architectural boundaries configuration for Micro Frontends
  {
    plugins: {
      boundaries: boundaries
    },
    settings: {
      "boundaries/elements": [
        {
          "type": "core",
          "pattern": "src/app/core/**/*"
        },
        {
          "type": "shared",
          "pattern": "src/app/shared/**/*"
        },
        {
          "type": "feature",
          "pattern": "src/app/features/:feature/**/*"
        }
      ]
    },
    rules: {
      // Enforce entry points for features to prevent deep imports
      "boundaries/entry-point": [
        "error",
        {
          "defaultAllow": true,
          "rules": [
            {
              "target": "feature",
              "allow": ["index.ts", "public-api.ts"]
            }
          ]
        }
      ],
      // Enforce strict element import hierarchy
      "boundaries/element-types": [
        "error",
        {
          "defaultAllow": true,
          "rules": [
            // Rule 1: A feature cannot import from another feature (isolation)
            {
              "from": "feature",
              "disallow": [
                ["feature", { "feature": "!${from.feature}" }]
              ],
              "message": "Feature \"${from.feature}\" is not allowed to import from another feature \"${to.feature}\". Features must remain isolated."
            },
            // Rule 2: Core layer cannot import from features (prevents circular layout dependencies)
            {
              "from": "core",
              "disallow": ["feature"],
              "message": "Core layer cannot import from features."
            }
          ]
        }
      ]
    }
  },

  // 3. Prettier override to disable conflicting formatting rules
  eslintConfigPrettier
];
