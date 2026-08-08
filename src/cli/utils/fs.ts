import * as fs from 'node:fs';
import * as path from 'node:path';

export function writeFileSafely(filePath: string, content: string, mode?: number): void {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, content, { encoding: 'utf8', mode });
  } catch (err: any) {
    console.error(`❌ Failed to write "${path.basename(filePath)}": ${err.message}`);
    process.exit(1);
  }
}
