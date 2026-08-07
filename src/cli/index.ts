#!/usr/bin/env node

import { showHelp } from "./commands/help";
import { initLint } from "./commands/init-lint";
import { initHooks } from "./commands/init-hooks";
import { initAi } from "./commands/init-ai";

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0] ? args[0].toLowerCase() : "";

  switch (command) {
    case "init-lint":
      initLint();
      break;
    case "init-hooks":
      initHooks();
      break;
    case "init-ai":
      initAi();
      break;
    case "init-all":
      initLint();
      initHooks();
      initAi();
      console.log("\n🎉 Setup complete! Your repository is fully compliant with FitLab standards.");
      break;
    case "help":
    case "-h":
    case "--help":
    case "":
      showHelp();
      break;
    default:
      console.log(`❌ Unknown command: "${command}"`);
      showHelp();
      process.exit(1);
  }
}

main();
