import type { Settings } from '@internal/core';
import type { ComponentType } from 'react';
import { facebookSettings } from '@internal/site-facebook/settings';
import { instagramSettings } from '@internal/site-instagram/settings';
import { youtubeSettings } from '@internal/site-youtube/settings';

import { FacebookSettings } from './FacebookSettings';
import { InstagramSettings } from './InstagramSettings';
import { YoutubeSettings } from './YoutubeSettings';

export interface SiteTab {
  id: string;
  // Locale key of the tab label.
  label: string;
  settings: Settings;
  // The settings rendered in the tab.
  content: ComponentType;
}

// One settings tab per supported site.
export const siteTabs: SiteTab[] = [
  {
    id: 'instagram',
    label: 'tab_instagram',
    settings: instagramSettings,
    content: InstagramSettings,
  },
  {
    id: 'facebook',
    label: 'tab_facebook',
    settings: facebookSettings,
    content: FacebookSettings,
  },
  {
    id: 'youtube',
    label: 'tab_youtube',
    settings: youtubeSettings,
    content: YoutubeSettings,
  },
];
