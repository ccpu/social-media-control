import type { SiteDefinition } from '@internal/core';
import { facebookSite } from '@internal/site-facebook/site';
import { instagramSite } from '@internal/site-instagram/site';

// Every site the extension supports. To add a site, create a `packages/site-<name>` package and register it here.
export const sites: SiteDefinition[] = [instagramSite, facebookSite];
