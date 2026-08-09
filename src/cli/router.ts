import { COMMANDS, CommandFn } from './commands';
import { showHelp } from './commands/help';

const commandMap = new Map<string, CommandFn>();

for (const [name, def] of Object.entries(COMMANDS)) {
  commandMap.set(name, def.handler);
  def.aliases?.forEach((alias) => commandMap.set(alias, def.handler));
}

export function executeCommand(
  commandName: string,
  args: string[]
): void | Promise<void> {
  const normalized = commandName.toLowerCase();
  const handler = commandMap.get(normalized);

  if (!handler) {
    console.log(`❌ Unknown command: "${commandName}"`);
    showHelp();
    process.exit(1);
  }

  return handler(args);
}
