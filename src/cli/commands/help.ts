export function showHelp(): void {
  console.log(`
🏋️  FitLab Tooling CLI - Quality Governance Setup Helper
======================================================
Usage:
  npx @fitlab/tooling <command>

Available Commands:
  init-lint   : Configures ESLint Flat Config (eslint.config.js) in the repository.
  init-hooks  : Initializes Husky and Commitlint (Conventional Commits) with quality gates.
  init-all    : Runs both init-lint and init-hooks sequentially.
  help, -h    : Show this help menu.
`);
}
