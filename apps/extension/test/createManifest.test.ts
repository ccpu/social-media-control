import type { SiteDefinition } from '@internal/core';
import { describe, expect, it } from 'vitest';

import { createManifest, styleFileName } from '../scripts/createManifest';
import { sites } from '../src/sites';

const info = {
  version: '1.2.3',
  homepageUrl: 'https://example.com',
  geckoId: '{test}',
};

const site: SiteDefinition = {
  id: 'example',
  matches: ['*://*.example.com/*'],
  scripts: [
    {
      name: 'page',
      entry: '@internal/site-example/page',
      world: 'MAIN',
      runAt: 'document_start',
      allFrames: true,
    },
    { name: 'content', entry: '@internal/site-example/content', css: ['@x/styles.css'] },
  ],
  webAccessibleResources: ['images/*.svg'],
};

describe('createManifest', () => {
  it('creates a Manifest V3 for Chrome', () => {
    const manifest = createManifest('chrome', info, [site]);

    expect(manifest).toMatchObject({
      manifest_version: 3,
      version: '1.2.3',
      action: { default_popup: 'html/popup.html' },
      web_accessible_resources: [
        { resources: ['images/*.svg'], matches: ['*://*.example.com/*'] },
      ],
    });
    expect(manifest).not.toHaveProperty('browser_specific_settings');
  });

  it('creates a Manifest V2 with a gecko id for Firefox', () => {
    const manifest = createManifest('firefox', info, [site]);

    expect(manifest).toMatchObject({
      manifest_version: 2,
      browser_action: { default_popup: 'html/popup.html' },
      web_accessible_resources: ['images/*.svg'],
      browser_specific_settings: { gecko: { id: '{test}' } },
    });
  });

  it('maps site scripts to content scripts', () => {
    const manifest = createManifest('chrome', info, [site]);

    expect(manifest.content_scripts).toEqual([
      {
        matches: ['*://*.example.com/*'],
        js: ['js/example-page.js'],
        run_at: 'document_start',
        all_frames: true,
        world: 'MAIN',
      },
      {
        matches: ['*://*.example.com/*'],
        js: ['js/example-content.js'],
        css: ['styles/example-styles.css'],
      },
    ]);
  });

  it('skips web accessible resources for sites without any', () => {
    const manifest = createManifest('chrome', info, [
      { ...site, webAccessibleResources: [] },
    ]);

    expect(manifest.web_accessible_resources).toEqual([]);
  });

  it('registers every supported site', () => {
    const manifest = createManifest('chrome', info, sites);
    const matches = (manifest.content_scripts as { matches: string[] }[]).flatMap(
      (script) => script.matches,
    );

    expect(new Set(matches)).toEqual(
      new Set(['*://*.instagram.com/*', '*://*.facebook.com/*']),
    );
  });
});

describe('styleFileName', () => {
  it('prefixes the style sheet with the site id', () => {
    expect(styleFileName(site, '@internal/site-example/styles.css')).toBe(
      'styles/example-styles.css',
    );
  });
});
