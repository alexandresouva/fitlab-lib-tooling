import fs from 'node:fs';

// Cross-platform cleanup of dist directory before build
fs.rmSync('dist', { recursive: true, force: true });
