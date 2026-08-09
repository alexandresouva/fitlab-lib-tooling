import * as fs from 'node:fs';
import * as path from 'node:path';

export function initDocs(cwd: string = process.cwd()): void {
  console.log('⚙️  Setting up Project Documentation & Architecture Guides...');

  // Resolve doc-templates directory (works in dev and in compiled dist)
  const templateDir = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'doc-templates'
  );
  const targetDocsDir = path.join(cwd, 'docs');

  if (!fs.existsSync(templateDir)) {
    console.error(
      `❌ Documentation templates directory not found at: ${templateDir}`
    );
    process.exit(1);
  }

  try {
    fs.mkdirSync(targetDocsDir, { recursive: true });
    fs.cpSync(templateDir, targetDocsDir, { recursive: true });
    console.log(
      '✓ Created docs/ directory with architecture, testing guidelines, and engineering templates.'
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to copy documentation templates: ${msg}`);
    process.exit(1);
  }
}
