import * as fs from 'node:fs';
import * as path from 'node:path';

export function writeFileSafely(filePath: string, content: string, mode?: number): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, { encoding: 'utf8', mode });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to write "${path.basename(filePath)}": ${msg}`);
    process.exit(1);
  }
}
