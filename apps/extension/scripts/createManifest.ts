import type { SiteDefinition, SiteScript } from '@internal/core';

// Browsers the extension is packaged for. Chrome uses Manifest V3, Firefox Manifest V2.
export type BrowserTarget = 'chrome' | 'firefox';

// Values that are not derived from the site definitions.
export interface ExtensionInfo {
  version: string;
  homepageUrl: string;
  geckoId: string;
}

const iconSizes = [16, 32, 48, 64, 128];

// Returns the output path of a site script bundle.
export function bundleFileName(site: SiteDefinition, script: SiteScript): string {
  return `js/${site.id}-${script.name}.js`;
}

// Returns the output path of a site style sheet, given its module specifier.
export function styleFileName(site: SiteDefinition, specifier: string): string {
  return `styles/${site.id}-${specifier.split('/').pop()}`;
}

// Builds the `manifest.json` content for the given browser.
export function createManifest(
  target: BrowserTarget,
  info: ExtensionInfo,
  sites: SiteDefinition[],
): Record<string, unknown> {
  const icon = (size: number) => `icons/icon-${size}.png`;
  const action = {
    default_title: '__MSG_extension_name__',
    default_popup: 'html/popup.html',
    default_icon: { 16: icon(16), 32: icon(32) },
  };
  const base = {
    name: '__MSG_extension_name__',
    description: '__MSG_extension_description__',
    version: info.version,
    homepage_url: info.homepageUrl,
    default_locale: 'en',
    icons: Object.fromEntries(iconSizes.map((size) => [size, icon(size)])),
    content_scripts: sites.flatMap((site) => createContentScripts(site)),
    permissions: ['storage'],
  };
  const sitesWithResources = sites.filter((site) => site.webAccessibleResources?.length);

  if (target === 'chrome') {
    return {
      manifest_version: 3,
      ...base,
      action,
      web_accessible_resources: sitesWithResources.map((site) => ({
        resources: site.webAccessibleResources,
        matches: site.matches,
      })),
    };
  }

  return {
    manifest_version: 2,
    ...base,
    browser_action: action,
    web_accessible_resources: [
      ...new Set(sitesWithResources.flatMap((site) => site.webAccessibleResources ?? [])),
    ],
    browser_specific_settings: {
      gecko: { id: info.geckoId, data_collection_permissions: { required: ['none'] } },
    },
  };
}

// Maps the scripts of a site to manifest content script entries.
function createContentScripts(site: SiteDefinition): Record<string, unknown>[] {
  return site.scripts.map((script) => ({
    matches: site.matches,
    js: [bundleFileName(site, script)],
    ...(script.css?.length && { css: script.css.map((css) => styleFileName(site, css)) }),
    ...(script.runAt && { run_at: script.runAt }),
    ...(script.allFrames && { all_frames: true }),
    ...(script.world && { world: script.world }),
  }));
}
