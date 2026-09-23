import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { Resvg } from '@resvg/resvg-js';

// Renders `assets/icon.svg` into the PNG sizes used by the manifest. Run after changing the icon.

const appDir = fileURLToPath(new URL('..', import.meta.url));
const svg = readFileSync(join(appDir, 'assets/icon.svg'));
const outDir = join(appDir, 'public/icons');
mkdirSync(outDir, { recursive: true });

for (const size of [16, 32, 48, 64, 128]) {
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
  writeFileSync(join(outDir, `icon-${size}.png`), png);
  console.info(`icons/icon-${size}.png`);
}
