import { showHelp } from './commands/help';
import { initLint } from './commands/init-lint';
import { initHooks } from './commands/init-hooks';
import { initAi } from './commands/init-ai';
import { initDocs } from './commands/init-docs';
import { newApp } from './commands/new-app';
import { ensurePackageScripts } from './utils/package-scripts';

export type CommandFn = (args: string[]) => void | Promise<void>;

export type CommandDefinition = {
  description: string;
  aliases?: string[];
  handler: CommandFn;
};

export const COMMANDS: Record<string, CommandDefinition> = {
  'new-app': {
    description: 'Create a new Micro Frontend application',
    handler: (args) => newApp(args)
  },
  'init-lint': {
    description: 'Configure ESLint + Prettier',
    handler: () => initLint()
  },
  'init-hooks': {
    description: 'Configure Husky + commitlint',
    handler: () => initHooks()
  },
  'init-ai': {
    description: 'Setup AI rules and workflows',
    handler: () => initAi()
  },
  'init-docs': {
    description: 'Setup universal documentation and architecture guidelines',
    handler: () => initDocs()
  },
  'init-all': {
    description: 'Setup all standard configurations at once',
    handler: () => {
      initLint();
      initHooks();
      initAi();
      initDocs();
      ensurePackageScripts();
      console.log(
        '\n🎉 Setup complete! Your repository is fully compliant with FitLab standards.'
      );
    }
  },
  help: {
    description: 'Display help information',
    aliases: ['-h', '--help', ''],
    handler: () => showHelp()
  }
};
