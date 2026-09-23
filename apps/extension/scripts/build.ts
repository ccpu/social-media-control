import type { BrowserTarget, ExtensionInfo } from './createManifest';
import {
  copyFileSync,
  cpSync,
  mkdirSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { sites } from '../src/sites';
import { bundleScript } from './bundleScript';
import { bundleFileName, createManifest, styleFileName } from './createManifest';
import { zipDirectory } from './zipDirectory';

// Builds the extension for every browser into `dist/<browser>` and `dist/<name>-<browser>-<version>.zip`.

const appDir = fileURLToPath(new URL('..', import.meta.url));
const distDir = join(appDir, 'dist');
const bundleDir = join(distDir, '.bundle');
const targets: BrowserTarget[] = ['chrome', 'firefox'];

const pkg = JSON.parse(readFileSync(join(appDir, 'package.json'), 'utf8')) as {
  version: string;
  homepage: string;
};
const info: ExtensionInfo = {
  version: pkg.version,
  homepageUrl: pkg.homepage,
  geckoId: '{7229495f-57f6-478d-aac1-97408f00e6c7}',
};

// Resolves a module specifier like `@internal/site-instagram/page` to its file path.
const resolveFile = (specifier: string) => fileURLToPath(import.meta.resolve(specifier));

rmSync(distDir, { recursive: true, force: true });

// Bundle every site script and the popup once; the output is the same for all browsers.
for (const site of sites) {
  for (const script of site.scripts) {
    // eslint-disable-next-line no-await-in-loop -- Vite builds run one after another.
    await bundleScript(
      resolveFile(script.entry),
      bundleDir,
      bundleFileName(site, script),
    );
  }
}
await bundleScript(join(appDir, 'src/popup/main.ts'), bundleDir, 'js/popup.js');

for (const target of targets) {
  const targetDir = join(distDir, target);
  cpSync(join(appDir, 'public'), targetDir, { recursive: true });
  cpSync(bundleDir, targetDir, { recursive: true });

  for (const site of sites) {
    for (const css of site.scripts.flatMap((script) => script.css ?? [])) {
      const outFile = join(targetDir, styleFileName(site, css));
      mkdirSync(dirname(outFile), { recursive: true });
      copyFileSync(resolveFile(css), outFile);
    }
  }

  const manifest = createManifest(target, info, sites);
  writeFileSync(
    join(targetDir, 'manifest.json'),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const zipFile = join(distDir, `social-media-control-${target}-${info.version}.zip`);
  // eslint-disable-next-line no-await-in-loop -- One zip per browser, in order.
  await zipDirectory(targetDir, zipFile);
  console.info(`Built ${target}: ${zipFile}`);
}

rmSync(bundleDir, { recursive: true, force: true });
