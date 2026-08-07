import * as fs from "node:fs";
import * as path from "node:path";

export function initAi(cwd: string = process.cwd()): void {
  console.log("⚙️  Setting up AI Coding Assistant Rules and Custom Skills...");

  // __dirname points to package_root/dist/cli/commands
  const sourceDir = path.resolve(__dirname, "..", "..", "..", "ai-templates");
  const targetCursorrules = path.join(cwd, ".cursorrules");
  const targetAgents = path.join(cwd, ".agents");

  // 1. Copy .cursorrules
  try {
    const srcCursorrules = path.join(sourceDir, "cursorrules");
    if (fs.existsSync(srcCursorrules)) {
      fs.cpSync(srcCursorrules, targetCursorrules);
      console.log("✓ Created .cursorrules in the repository root.");
    } else {
      console.warn("⚠️  Template 'cursorrules' not found inside the package.");
    }
  } catch (err: any) {
    console.error(`❌ Failed to copy .cursorrules: ${err.message}`);
    process.exit(1);
  }

  // 2. Copy .agents directory recursively
  try {
    const srcAgents = path.join(sourceDir, ".agents");
    if (fs.existsSync(srcAgents)) {
      fs.cpSync(srcAgents, targetAgents, { recursive: true });
      console.log("✓ Created .agents/ folder with custom rules, skills, and workflows.");
    } else {
      console.warn("⚠️  Template folder '.agents' not found inside the package.");
    }
  } catch (err: any) {
    console.error(`❌ Failed to copy .agents folder: ${err.message}`);
    process.exit(1);
  }
}
