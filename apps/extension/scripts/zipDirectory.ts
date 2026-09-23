import { createWriteStream } from 'node:fs';

import archiver from 'archiver';

// Zips the content of a directory (without the directory itself) into the given file.
export async function zipDirectory(sourceDir: string, zipFile: string): Promise<void> {
  const zip = archiver('zip');
  const output = createWriteStream(zipFile);
  const closed = new Promise<void>((resolve, reject) => {
    output.on('close', resolve);
    zip.on('error', reject);
  });

  zip.pipe(output);
  zip.directory(sourceDir, false);
  await zip.finalize();
  await closed;
}
