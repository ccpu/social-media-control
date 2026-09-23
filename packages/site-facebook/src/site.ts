import type { SiteDefinition } from '@internal/core';

// Facebook: auto-scroll in the Reels viewer.
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
