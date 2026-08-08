export function showHelp(): void {
  console.log(`
🏋️  FitLab Tooling CLI - Quality Governance Setup Helper
======================================================
Usage:
  npx @fitlab/tooling <command>

Available Commands:
  new-app     : Scaffolds a new MFE remote app workspace from scratch (e.g. new-app workout-planner).
  init-lint   : Configures ESLint Flat Config (eslint.config.mjs) in the repository.
  init-hooks  : Initializes Husky and Commitlint (Conventional Commits) with quality gates.
  init-ai     : Copies AI coding rules (.cursorrules) and Custom Skills (.agents/) to the repository.
  init-docs   : Copies universal project documentation, architecture, and engineering templates to docs/.
  init-all    : Runs lint, hooks, AI, docs, and project setup sequentially.
  help, -h    : Show this help menu.
`);
}
