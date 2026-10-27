import type { SiteDefinition } from '@internal/core';

// Facebook: autoplay with audio, mouse-wheel seeking on the seek bar and auto-scroll in the Reels viewer.
export const facebookSite: SiteDefinition = {
  id: 'facebook',
  matches: ['*://*.facebook.com/*'],
  scripts: [
    {
      name: 'content',
      entry: '@internal/site-facebook/content',
      runAt: 'document_start',
    },
  ],
};
