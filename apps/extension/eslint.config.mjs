import baseConfig from '@internal/eslint-config/react';

/** @type {import('eslint').Linter.Config[]} */
const config = [...baseConfig, { ignores: ['dist/**'] }];

export default config;
