import type { SiteDefinition } from '@internal/core';

// YouTube: mouse-wheel seeking on the seek bar.
export const youtubeSite: SiteDefinition = {
  id: 'youtube',
  matches: ['*://*.youtube.com/*'],
  scripts: [
    {
      name: 'content',
      entry: '@internal/site-youtube/content',
      runAt: 'document_start',
    },
  ],
};
