# Chrome Extension Monorepo Template

A template for building Chrome extensions using a monorepo structure with TypeScript, Vite, and more.

## Getting Started

1. Clone the repository
2. Run setup: `pnpm run setup`
3. Build the extension: `pnpm build`
4. Load the extension in Chrome from the `apps/chrome-extension/build` directory

Step 2 is a one-time step. Until `pnpm run setup` has run, `pnpm install` prints a
reminder and `git commit` is blocked. Setup ends by deleting the `setup/` folder,
so the gate removes itself. It is skipped in CI, in this template repo itself, and
with `SKIP_SETUP_CHECK=1`.

## Structure

- `apps/chrome-extension/`: The main Chrome extension app
- `packages/`: Shared packages (ui, utils, tooling)
- `tooling/`: Configuration for linting, formatting, etc.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## Acknowledgments

This template was originally inspired by [@guocaoyi](https://github.com/guocaoyi)’s [create-chrome-ext](https://github.com/guocaoyi/create-chrome-ext), but has been significantly restructured and enhanced with a new architecture, Tailwind CSS v4 integration, and additional development tools.

It also incorporates [@jacksteamdev](https://github.com/jacksteamdev)’s [crxjs](https://github.com/crxjs/chrome-extension-tools), which provides the Vite plugin used for Chrome Extension development.
