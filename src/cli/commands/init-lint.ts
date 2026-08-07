import * as fs from "fs";
import * as path from "path";

export function initLint(cwd: string = process.cwd()): void {
  console.log("⚙️  Setting up ESLint Flat Config...");
  const eslintConfigPath = path.join(cwd, "eslint.config.js");

  const eslintConfigContent = `import fitlabLint from '@fitlab/tooling/eslint';

export default [
  ...fitlabLint
];
`;

  try {
    fs.writeFileSync(eslintConfigPath, eslintConfigContent, { encoding: "utf8" });
    console.log("✓ Created eslint.config.js pointing to @fitlab/tooling/eslint");
  } catch (err: any) {
    console.error(`❌ Failed to create eslint.config.js: ${err.message}`);
    process.exit(1);
  }
}
