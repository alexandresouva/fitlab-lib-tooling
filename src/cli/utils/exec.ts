import { execSync, ExecSyncOptions } from 'node:child_process';

export function runCommand(
  command: string,
  options: ExecSyncOptions = {}
): void {
  execSync(command, {
    stdio: 'inherit',
    ...options,
    env: {
      ...process.env,
      NODE_NO_WARNINGS: '1',
      NG_CLI_ANALYTICS: 'false',
      CI: 'true',
      ...options.env
    }
  });
}

export function runStep(
  stepNumber: number,
  totalSteps: number,
  title: string,
  task: () => void
): void {
  try {
    console.log(`\n📦 ${stepNumber}/${totalSteps} ${title}`);
    task();
  } catch (err: any) {
    console.error(`❌ Failed during step "${title}": ${err.message}`);
    process.exit(1);
  }
}
