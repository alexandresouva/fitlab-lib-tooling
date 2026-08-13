import fs from 'node:fs';

// 1. Copy schematics assets (JSONs and templates), ignoring uncompiled .ts files
fs.cpSync('src/schematics', 'dist/schematics', {
  recursive: true,
  filter: (src) => !src.endsWith('.ts')
});

// 2. Copy styles assets
if (fs.existsSync('styles')) {
  fs.cpSync('styles', 'dist/styles', { recursive: true });
}

// 3. Set executable permissions for CLI binary
if (fs.existsSync('dist/cli/index.js')) {
  fs.chmodSync('dist/cli/index.js', 0o755);
}

console.log('✓ Assets copied and CLI executable permissions set.');
