import type { SiteDefinition } from '@internal/core';

// X: autoplay with audio, a remembered volume and mouse-wheel seeking on the seek bar.
export const xSite: SiteDefinition = {
  id: 'x',
  matches: ['*://*.x.com/*'],
  scripts: [
    {
      name: 'content',
      entry: '@internal/site-x/content',
      runAt: 'document_start',
    },
  ],
};
