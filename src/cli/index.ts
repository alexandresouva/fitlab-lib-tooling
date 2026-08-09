#!/usr/bin/env node

import { executeCommand } from './router';

function main(): void {
  const [command = '', ...restArgs] = process.argv.slice(2);
  executeCommand(command, restArgs);
}

main();
