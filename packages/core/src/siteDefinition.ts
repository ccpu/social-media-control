// Describes a supported website. The extension build turns these into bundles and manifest content scripts.
export interface SiteDefinition {
  // Unique id, used as prefix for bundle and style file names.
  id: string;

  // Match patterns of the pages the scripts are injected into.
  matches: string[];

  // Scripts injected into the matching pages.
  scripts: SiteScript[];

  // Extension files the page itself may load (e.g. control icons).
  webAccessibleResources?: string[];
}

// A single script injected into a site. The bundle is written to `js/<site id>-<name>.js`.
export interface SiteScript {
  // Bundle name, unique per site.
  name: string;

  // Module specifier of the script entry, e.g. `@internal/site-instagram/page`.
  entry: string;

  // `MAIN` runs in the page's JavaScript context (e.g. to hook into React). Defaults to the isolated extension context.
  world?: 'ISOLATED' | 'MAIN';

  // When the script is injected. Defaults to `document_idle`.
  runAt?: 'document_start' | 'document_end' | 'document_idle';

  // Inject into iframes as well.
  allFrames?: boolean;

  // Module specifiers of style sheets injected together with the script.
  css?: string[];
}
