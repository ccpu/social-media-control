import type { PluginOption } from 'vite';
import { build } from 'vite';

export interface BundleScriptOptions {
  plugins?: PluginOption[];
  // Output path of the extracted CSS, without the `.css` extension.
  cssFileName?: string;
}

// Bundles one entry into a self-contained classic script. Content scripts cannot be ES modules, and page scripts
// must run synchronously at `document_start`, so every entry is built on its own as an IIFE.
export async function bundleScript(
  entryFile: string,
  outDir: string,
  fileName: string,
  options: BundleScriptOptions = {},
): Promise<void> {
  await build({
    configFile: false,
    publicDir: false,
    logLevel: 'warn',
    plugins: options.plugins,
    // Library mode leaves `process.env` untouched, but libraries like React read it to pick their production build.
    define: { 'process.env.NODE_ENV': JSON.stringify('production') },
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
        cssFileName: options.cssFileName,
      },
    },
  });
}
