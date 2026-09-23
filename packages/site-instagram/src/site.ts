import type { SiteDefinition } from '@internal/core';

// Instagram: custom video controls, playback settings and auto-scroll on the Reels page.
export const instagramSite: SiteDefinition = {
  id: 'instagram',
  matches: ['*://*.instagram.com/*'],
  scripts: [
    {
      name: 'page',
      entry: '@internal/site-instagram/page',
      world: 'MAIN',
      runAt: 'document_start',
      allFrames: true,
    },
    {
      name: 'content',
      entry: '@internal/site-instagram/content',
      runAt: 'document_start',
      allFrames: true,
      css: ['@internal/site-instagram/styles.css'],
    },
  ],
  webAccessibleResources: ['images/*.svg', 'audio/*.mp3', 'js/*.js'],
};
