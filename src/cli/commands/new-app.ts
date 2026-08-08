import * as fs from 'node:fs';
import * as path from 'node:path';
import { parseArgs } from 'node:util';
import { runCommand, runStep } from '../utils/exec';

type NewAppOptions = {
  name: string;
  port: number;
  angularVersion: string;
};

function parseCliArgs(rawArgs: string[]): NewAppOptions {
  const { values, positionals } = parseArgs({
    args: rawArgs,
    options: {
      port: { type: 'string', default: '4201' },
      angular: { type: 'string', default: '18' }
    },
    allowPositionals: true
  });

  const name = positionals[0];
  if (!name) {
    console.error(
      '❌ Error: Missing app name. Usage: npx @fitlab/tooling new-app <name> [options]'
    );
    process.exit(1);
  }

  return {
    name,
    port: Number.parseInt(values.port!, 10),
    angularVersion: values.angular!
  };
}

export function newApp(args: string[]): void {
  const { name, port, angularVersion } = parseCliArgs(args);
  const dirName = `fitlab-mfe-${name}`;
  const targetDir = path.join(process.cwd(), dirName);

  if (fs.existsSync(targetDir)) {
    console.error(`❌ Error: Directory "${dirName}" already exists.`);
    process.exit(1);
  }

  console.log(`🚀 Bootstrapping new MFE App "${name}" in "${dirName}"...`);
  console.log(`   Angular Version  : ${angularVersion}`);
  console.log(`   Local Server Port: ${port}\n`);

  fs.mkdirSync(targetDir, { recursive: true });

  const toolingPath = path.resolve(__dirname, '..', '..', '..');
  const execOpts = { cwd: targetDir };

  const steps = [
    {
      title: 'Initializing blank Angular workspace...',
      run: () =>
        runCommand(
          `npx -y @angular/cli@${angularVersion} new ${dirName} --directory=. --style=scss --routing=true --ssr=false --skip-git=false`,
          execOpts
        )
    },
    {
      title: 'Integrating Native Federation...',
      run: () => {
        runCommand(
          `npm install -D @angular-architects/native-federation@${angularVersion}`,
          execOpts
        );
        runCommand(
          `npx ng add @angular-architects/native-federation --project=${dirName} --port=${port} --skip-confirmation`,
          execOpts
        );
      }
    },
    {
      title: 'Installing @fitlab/tooling devDependency...',
      run: () => runCommand(`npm install -D ${toolingPath}`, execOpts)
    },
    {
      title: 'Running FitLab custom schematic and quality setup...',
      run: () => {
        runCommand(
          `npx ng g @fitlab/tooling:mfe-remote ${name} --port=${port}`,
          execOpts
        );
        runCommand(`npx fitlab-tooling init-all`, execOpts);
      }
    }
  ];

  steps.forEach((step, idx) => {
    runStep(idx + 1, steps.length, step.title, step.run);
  });

  console.log(`\n🎉 Success! Your new MFE App "${dirName}" is ready!`);
  console.log(`👉 To start development, run: cd ${dirName} && npm run start\n`);
}
