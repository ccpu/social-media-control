import { build } from 'vite';

// Bundles one entry into a self-contained classic script. Content scripts cannot be ES modules, and page scripts
// must run synchronously at `document_start`, so every entry is built on its own as an IIFE.
export async function bundleScript(
  entryFile: string,
  outDir: string,
  fileName: string,
): Promise<void> {
  await build({
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    build: {
      outDir,
      emptyOutDir: false,
      // Readable output makes store reviews easier.
      minify: false,
      lib: {
        entry: entryFile,
        formats: ['iife'],
        name: 'socialMediaControl',
        fileName: () => fileName,
      },
    },
  });
}
