/*
 * This config file exists to prevent the VS Code ESLint extension
 * from searching for an ESLint config in the root folder.
 */

import config from './tooling/eslint/base.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default config;
