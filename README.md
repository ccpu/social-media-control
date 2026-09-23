<p align="center">
  <img width="96" src="apps/extension/assets/icon.svg" alt="Social Media Control icon" />
</p>

# Social Media Control

> Browser extension for Chrome and Firefox that adds video controls and auto-scroll to social media sites.

## Features

| Site      | Features                                                                                                                                                                                                              |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Instagram | Custom video controls (play, volume, seek, speed, fullscreen, picture-in-picture, download), mouse-wheel seeking on the control bar, autoplay and loop settings, auto-scroll to the next reel on `instagram.com/reels` |
| Facebook  | Auto-scroll to the next reel in the Reels viewer (`facebook.com/reel/…`)                                                                                                                                              |

All options live in the extension popup and apply to every supported site.

## Project structure

```txt
apps/extension/           The extension: popup, static assets, manifest generation and build
packages/core/            Shared code: settings, browser helpers, viewport/url helpers, the SiteDefinition contract
packages/react-fiber/     Hooks into a page's React renderer (DevTools hook + fiber tree helpers)
packages/site-instagram/  Instagram support
packages/site-facebook/   Facebook support
tooling/                  Shared ESLint, Prettier, TypeScript and Vitest configs
```

Rules that keep the sites separate:

- A site package depends on `@internal/core` (and `@internal/react-fiber` if it needs React access), never on another site.
- Each site describes itself with a `SiteDefinition` in `src/site.ts`: URL match patterns, its scripts and their styles.
- The app only composes sites. `apps/extension/src/sites.ts` lists them, and the build turns each definition into bundles and manifest content scripts.

## Adding a site

1. Create `packages/site-<name>`. `packages/site-facebook` is the smallest starting point.
2. Export a `SiteDefinition` from `src/site.ts` and expose `./site` plus every script entry in the package `exports`.
3. Add `"@internal/site-<name>": "workspace:*"` to `apps/extension/package.json` and register the site in `apps/extension/src/sites.ts`.
4. Run `pnpm install` and `pnpm build`.

Scripts run in the isolated extension context by default, where they can use `Settings` directly. Use `world: 'MAIN'` only when the script needs the page's own JavaScript (for example to hook into React). `MAIN` scripts have no extension APIs, so pair them with an isolated script that forwards the settings through `window.postMessage`, as `site-instagram` does.

## Development

```sh
pnpm install
pnpm build       # apps/extension/dist/{chrome,firefox} and zip files
pnpm test
pnpm lint
pnpm typecheck
```

Load the unpacked build:

- **Chrome:** open `chrome://extensions`, enable _Developer mode_, click _Load unpacked_ and select `apps/extension/dist/chrome`.
- **Firefox:** open `about:debugging#/runtime/this-firefox`, click _Load Temporary Add-on_ and select `apps/extension/dist/firefox/manifest.json`.

Or let `web-ext` start a browser with the extension: `pnpm --filter extension start:chromium` (or `start:firefox`).

The toolbar icons are rendered from `apps/extension/assets/icon.svg`. After changing it, run `pnpm --filter extension icons`.

## Credits

The Instagram support is based on [Video Control for Instagram](https://github.com/Arcus92/instagram-video-control) by David Schulte, licensed under MIT.

## License

[MIT](LICENSE)
