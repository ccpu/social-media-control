import reactConfig from '@internal/eslint-config/react';

/** @type {import('eslint').Linter.Config[]} */
const config = [
  ...reactConfig,
  {
    ignores: ['build/**', 'node_modules/**', 'src/zip.js'],
  },
];

export default config;
